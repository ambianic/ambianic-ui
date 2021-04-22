import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { cloneDeep } from 'lodash'
import pnp from '@/store/pnp.js'
import {
  PEER_DISCONNECTED,
  PEER_CONNECTING,
  PEER_DISCOVERING,
  PEER_DISCOVERED,
  PEER_AUTHENTICATING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR,
  PNP_SERVICE_DISCONNECTED,
  PNP_SERVICE_CONNECTING,
  PNP_SERVICE_CONNECTED,
  USER_MESSAGE,
  NEW_PEER_ID,
  NEW_REMOTE_PEER_ID,
  REMOTE_PEER_ID_REMOVED,
  PEER_FETCH
} from '@/store/mutation-types.js'
import {
  INITIALIZE_PNP,
  PNP_SERVICE_CONNECT,
  PNP_SERVICE_RECONNECT,
  PEER_DISCOVER,
  PEER_CONNECT,
  PEER_AUTHENTICATE,
  REMOVE_REMOTE_PEER_ID,
  CHANGE_REMOTE_PEER_ID,
  HANDLE_PEER_CONNECTION_ERROR
} from '@/store/action-types.js'
import { ambianicConf } from '@/config'

import Peer from 'peerjs'
import { PeerRoom } from '@/remote/peer-room'
import { PeerFetch } from '@/remote/peer-fetch'

jest.mock('peerjs') // Peer is now a mock class
jest.mock('@/remote/peer-room') // PeerRoom is now a mock class
jest.mock('@/remote/peer-fetch') // PeerFetch is now a mock class


describe('PnP state machine actions - p2p communication layer', () => {
// global
  
  // localVue is used for tests instead of the production Vue instance
  let localVue

  // the Vuex store we will be testing against
  let store

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store({ modules: { pnp: cloneDeep(pnp) } })
    // mocking window.RTCPeerConnection
    const mockPeerConnection = jest.fn()
    // mocking the RTCPeerConnection.on() method
    mockPeerConnection.on = jest.fn()
    // mocking Peer.connect() to return an RTCPeerConnection mock
    jest.spyOn(Peer.prototype, 'connect').mockImplementation(() => mockPeerConnection)
    // fast forward js timers during testing
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.resetAllMocks()
  })
  
  // test Vuex actions

  // Tests functions are async since Vuex actions are async.
  // This allows use of await which makes the code more readable.

  test('INITIALIZE_PNP on app start', async () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    await store.dispatch(INITIALIZE_PNP)
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    expect(Peer).toHaveBeenCalledTimes(1);
    expect(Peer).toHaveBeenCalledWith(store.state.myPeerId,
      {
        host: ambianicConf.AMBIANIC_PNP_HOST,
        port: ambianicConf.AMBIANIC_PNP_PORT,
        secure: ambianicConf.AMBIANIC_PNP_SECURE,
        debug: 3
      });
  })

  test('PNP_SERVICE_CONNECT on app start', async () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    await store.dispatch(PNP_SERVICE_CONNECT)
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    expect(Peer).toHaveBeenCalledTimes(1)
    const peer = store.state.pnp.peer
    expect(peer.on).toHaveBeenCalledTimes(5)
    expect(peer.on).toHaveBeenCalledWith(
      'open',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'disconnected',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'close',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'error',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'connection',
      expect.anything()
    )
  })

  test('PNP_SERVICE_RECONNECT assuming existing peer disconnected', async () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate via mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some ID'
    store.state.pnp.myPeerId = 'some saved ID'
    await store.dispatch(PNP_SERVICE_RECONNECT)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
    expect(peer._lastServerId).toBe('some saved ID')
    expect(peer.reconnect).toHaveBeenCalledTimes(1)
  })

  test('PNP_SERVICE_RECONNECT when peer lost id', async () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate via mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    store.state.pnp.myPeerId = 'some ID'
    peer.id = undefined
    await store.dispatch(PNP_SERVICE_RECONNECT)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
    expect(peer._id).toBe('some ID')
    expect(peer._lastServerId).toBe('some ID')
    expect(peer.reconnect).toHaveBeenCalledTimes(1)
  })

  test('PEER_DISCOVER when peer is connected', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).not.toBe(PEER_DISCOVERING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTED)
  })

  test('PEER_DISCOVER when peer is disconnected and local and remote peer ids are known', async () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    store.state.pnp.myPeerId = 'some_saved_ID'
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
    // At this point in time, there should have been a single call to
    // setTimeout to schedule another peer discovery loop.
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), store.state.pnp.discoveryLoopPause);
    // emulate the use case when remotePeerId is already known
    // and connection is established
    store.state.pnp.remotePeerId = 'a_known_remote_peer_id'
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    console.debug('jest running pending timers')
    await jest.runOnlyPendingTimers()
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
  })

  test('PEER_DISCOVER when peer is connected to pnp/signaling service and remote peerid is not known', async () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'my_local_peer_id'
    store.state.pnp.myPeerId = peer.id
    // emulate one remote peer in the room
    const roomMembers = { clientsIds: [peer.id, 'a_remote_peer_id'] }
    jest.spyOn(PeerRoom.prototype, 'getRoomMembers').mockImplementationOnce(
      () => {
        console.debug('mock roomMembers', roomMembers)
        return roomMembers
      }
    )
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
    expect(PeerRoom).toHaveBeenCalledTimes(1)
    expect(PeerRoom).toHaveBeenLastCalledWith(peer)
    expect(PeerRoom.prototype.getRoomMembers).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenLastCalledWith(
      'a_remote_peer_id', 
      { label: 'http-proxy', reliable: true, serialization: 'raw' }
    )
  })

  test('PEER_DISCOVER when there is a known remote peer id and it has been marked as problematic to connect to', async () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'my_local_peer_id'
    store.state.pnp.myPeerId = peer.id
    // emulate one remote peer in the room that is known to be problematics
    const aProblematicRemotePeerId = 'a_problematic_remote_peer_id'
    store.state.pnp.problematicRemotePeers.clear()
    store.state.pnp.problematicRemotePeers.add(aProblematicRemotePeerId)
    const roomMembers = { clientsIds: [peer.id, aProblematicRemotePeerId ] }
    jest.spyOn(PeerRoom.prototype, 'getRoomMembers').mockImplementationOnce(
      () => {
        console.debug('mock roomMembers', roomMembers)
        return roomMembers
      }
    )
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
    expect(PeerRoom).toHaveBeenCalledTimes(1)
    expect(PeerRoom).toHaveBeenLastCalledWith(peer)
    expect(PeerRoom.prototype.getRoomMembers).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenLastCalledWith(
      aProblematicRemotePeerId, 
      { label: 'http-proxy', reliable: true, serialization: 'raw' }
    )
  })

  test('PEER_DISCOVER when there is no remote peer listed in the peer room', async () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'my_local_peer_id'
    store.state.pnp.myPeerId = peer.id
    // only the local peer is listed in the peer room, no remote peers registered
    const roomMembers = { clientsIds: [peer.id] }
    jest.spyOn(PeerRoom.prototype, 'getRoomMembers').mockImplementationOnce(
      () => {
        console.debug('mock roomMembers', roomMembers)
        return roomMembers
      }
    )
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
    expect(PeerRoom).toHaveBeenCalledTimes(1)
    expect(PeerRoom).toHaveBeenLastCalledWith(peer)
    expect(PeerRoom.prototype.getRoomMembers).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenCalledTimes(0)
    expect(store.state.pnp.userMessage).toEqual(expect.stringContaining('Still looking'))
  })

  test('Exception during PEER_DISCOVER', async () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'my_local_peer_id'
    store.state.pnp.myPeerId = peer.id
    // emulate error thrown while fetching room members
    jest.spyOn(PeerRoom.prototype, 'getRoomMembers').mockImplementationOnce(
      () => {
        throw new Error('Problem occured during peer discovery.')
      }
    )
    await store.dispatch(PEER_DISCOVER)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
    expect(PeerRoom).toHaveBeenCalledTimes(1)
    expect(PeerRoom).toHaveBeenLastCalledWith(peer)
    expect(PeerRoom.prototype.getRoomMembers).toHaveBeenCalledTimes(1)
    expect(Peer.prototype.connect).toHaveBeenCalledTimes(0)
  })

  test('Exception thrown by Peer.destroy()', async () => {
    // emulate peer is disconnected
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    // emulate PNP signaling service connection exists
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    expect(Peer).toHaveBeenCalledTimes(1)
    store.state.pnp.myPeerId = 'some_saved_ID'
    // emulate a dangling peerConnection still exists
    const peerConnection = jest.fn()
    store.state.pnp.peerConnection = peerConnection
    peerConnection.close = jest.fn()
    // emulate a known remote peer id
    const remotePeerId = 'a_known_remote_peer_id'
    // emulate PEER_CONNECT vuex action
    await store.dispatch(PEER_CONNECT, remotePeerId)

    expect(store.state.pnp.peerConnection.close).toHaveBeenCalledTimes(1)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)

    // At this point in time, there should have been a single call to
    // setTimeout to schedule a check on pending connections in 30 seconds
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30000)

    peer.peerDestroyErrorThrown = false
    // emulate error thrown while fetching room members
    jest.spyOn(Peer.prototype, 'destroy').mockImplementationOnce(
      () => {
        peer.peerDestroyErrorThrown = true
        throw new Error('Problem occured during peer discovery.')
      }
    )

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    console.debug('jest running pending timers')
    await jest.runOnlyPendingTimers()
    // existing peer should have been destroyed
    expect(peer.destroy).toHaveBeenCalledTimes(1)
    expect(peer.peerDestroyErrorThrown).toBeTruthy()
    // new peer instance should have been created
    console.debug('Peer constructor calls', Peer.mock.calls)
    expect(Peer).toHaveBeenCalledTimes(2)
    expect(store.state.pnp.peer).not.toBe(peer)
    // reconnect sequence should have been started
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
  })

  test('PEER_CONNECT attempt connection to a remote peer that is not responding', async () => {
    // emulate peer is disconnected
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    // emulate PNP signaling service connection exists
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    expect(Peer).toHaveBeenCalledTimes(1)
    store.state.pnp.myPeerId = 'some_saved_ID'
    // emulate a dangling peerConnection still exists
    const peerConnection = jest.fn()
    store.state.pnp.peerConnection = peerConnection
    peerConnection.close = jest.fn()
    // emulate a known remote peer id
    const remotePeerId = 'a_known_remote_peer_id'
    // emulate PEER_CONNECT vuex action
    await store.dispatch(PEER_CONNECT, remotePeerId)

    expect(store.state.pnp.peerConnection.close).toHaveBeenCalledTimes(1)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)

    // At this point in time, there should have been a single call to
    // setTimeout to schedule a check on pending connections in 30 seconds
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 30000)

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    console.debug('jest running pending timers')
    await jest.runOnlyPendingTimers()

    // existing peer should have been destroyed
    expect(peer.destroy).toHaveBeenCalledTimes(1)
    // new peer instance should have been created
    console.debug('Peer constructor calls', Peer.mock.calls)
    expect(Peer).toHaveBeenCalledTimes(2)
    expect(store.state.pnp.peer).not.toBe(peer)
    // reconnect sequence should have been started
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
  })

  test('PEER_CONNECT attempt while PNP Service is NOT CONNECTED', async () => {
    // emulate peer is disconnected
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    // emulate PNP signaling service connection exists
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_DISCONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    expect(Peer).toHaveBeenCalledTimes(1)
    store.state.pnp.myPeerId = 'some_saved_ID'
    // emulate a known remote peer id
    const remotePeerId = 'a_known_remote_peer_id'
    // emulate PEER_CONNECT vuex action
    await store.dispatch(PEER_CONNECT, remotePeerId)
    expect(Peer.prototype.reconnect).toHaveBeenCalledTimes(1)
  })

  test('PEER_CONNECT attempt when peer already CONNECTING', async () => {
    // emulate peer is disconnected
    store.state.pnp.peerConnectionStatus = PEER_CONNECTING
    // emulate PNP signaling service connection exists
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    expect(Peer).toHaveBeenCalledTimes(1)
    store.state.pnp.myPeerId = 'some_saved_ID'
    // emulate a dangling peerConnection still exists
    const peerConnection = jest.fn()
    store.state.pnp.peerConnection = peerConnection
    peerConnection.close = jest.fn()
    peerConnection.connect = jest.fn()
    // emulate a known remote peer id
    const remotePeerId = 'a_known_remote_peer_id'
    // emulate PEER_CONNECT vuex action
    await store.dispatch(PEER_CONNECT, remotePeerId)
    expect(store.state.pnp.peerConnection.close).toHaveBeenCalledTimes(0)
    expect(store.state.pnp.peerConnection.connect).toHaveBeenCalledTimes(0)
    expect(setTimeout).toHaveBeenCalledTimes(0)
    expect(peer.destroy).toHaveBeenCalledTimes(0)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
  })

  test('PEER_CONNECT attempt when peer already CONNECTED', async () => {
    // emulate peer is disconnected
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    // emulate PNP signaling service connection exists
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    expect(Peer).toHaveBeenCalledTimes(1)
    store.state.pnp.myPeerId = 'some_saved_ID'
    // emulate a dangling peerConnection still exists
    const peerConnection = jest.fn()
    store.state.pnp.peerConnection = peerConnection
    peerConnection.close = jest.fn()
    peerConnection.connect = jest.fn()
    // emulate a known remote peer id
    const remotePeerId = 'a_known_remote_peer_id'
    // emulate PEER_CONNECT vuex action
    await store.dispatch(PEER_CONNECT, remotePeerId)
    expect(store.state.pnp.peerConnection.close).toHaveBeenCalledTimes(0)
    expect(store.state.pnp.peerConnection.connect).toHaveBeenCalledTimes(0)
    expect(setTimeout).toHaveBeenCalledTimes(0)
    expect(peer.destroy).toHaveBeenCalledTimes(0)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTED)
  })

  test('pnp service "error" callback: Peer.on("error")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    console.debug('peer.on.mock.calls', peer.on.mock.calls)
    const onErrorCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'error');
    console.debug('onErrorCallback', onErrorCallback)
    onErrorCallback[1]('a_network_error')
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    // setTimeout should be called to INITIALIZE_PNP
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000)
    // fast forward timer to trigger INITIALIZE_PNP action
    await jest.runOnlyPendingTimers()
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
  })

  test('pnp service "connection" callback: Peer.on("connection")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    console.debug('peer.on.mock.calls', peer.on.mock.calls)
    const onConnectionCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'connection')
    console.debug('onConnectionCallback', onConnectionCallback)
    // emulate an RTCPeerConnection has been established
    const peerConnection = peer.connect('a_remote_peer_id')
    onConnectionCallback[1](peerConnection)
    // check that peerConnection callbacks were setup
    expect(peerConnection.on).toHaveBeenCalledTimes(3)
    expect(peerConnection.on).toHaveBeenCalledWith(
      'open',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'close',
      expect.anything()
    )
    expect(peer.on).toHaveBeenCalledWith(
      'error',
      expect.anything()
    )
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
  })

  test('pnp service "close" callback: Peer.on("close")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    const onCloseCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'close')
    console.debug('onCloseCallback', onCloseCallback)
    // emulate invokation of the Peer.on('close') callback methods
    onCloseCallback[1]()
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    // setTimeout should be called to INITIALIZE_PNP
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000)
    // run timer that calls INITIALIZE_PNP
    await jest.runOnlyPendingTimers()
    // a new Peer should have been created
    expect(Peer).toHaveBeenCalledTimes(2)
    expect(store.state.pnp.peer).not.toBe(peer)
  })

  test('pnp service "disconnected" callback: Peer.on("disconnected")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    // emulate peer is in connected state to the signaling/pnp service before the disconnect takes place
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECT
    const onDisconnectedCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'disconnected');
    onDisconnectedCallback[1]()
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
  })

  test('pnp service "open" callback and no existing peer.id: Peer.on("open")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    expect(peer.id).not.toBeDefined()
    // emulate a saved old peer id
    store.state.pnp.myPeerId = 'a_saved_peer_id_567'
    // emulate a known remotePeerId to skip testing discovery code here
    store.state.pnp.remotePeerId = 'a_known_remote_peer_id'
    // emulate peer is in diconnected state to the signaling/pnp service before the 'open' callback
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_DISCONNECTED
    const onOpenCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'open')
    onOpenCallback[1]()
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTED)
    expect(peer.id).toBe(store.state.pnp.myPeerId)
  })

  test('pnp service "open" callback and existing peer.id: Peer.on("open")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    expect(peer.id).not.toBeDefined()
    // emulate a saved old peer id
    store.state.pnp.myPeerId = 'a_saved_peer_id_567'
    // emulate a new peer.id is found
    peer.id = 'a_known_peer_id_123'
    // emulate a known remotePeerId to skip testing discovery code here
    store.state.pnp.remotePeerId = 'a_known_remote_peer_id'
    // emulate peer is in diconnected state to the signaling/pnp service before the 'open' callback
    store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_DISCONNECTED
    const onOpenCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'open')
    let newPeerIdCommitted = false
    let newPeerIdValue
    const unsub = store.subscribe((mutation, state) => {
      if (mutation.type === NEW_PEER_ID) {
        newPeerIdCommitted = true
        newPeerIdValue = mutation.payload
      }
      console.debug('mutation.type', mutation.type)
      console.debug('mutation.payload', mutation.payload)
    })

    onOpenCallback[1]()
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTED)
    expect(peer.id).toBe(store.state.pnp.myPeerId)
    expect(newPeerIdCommitted).toBeTruthy()
    expect(newPeerIdValue).toBe('a_known_peer_id_123')
    // release mutation subscription
    unsub()
  })

  test('RTCPeerConnection "open" callback: RTCPeerConnection.on("open")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    console.debug('peer.on.mock.calls', peer.on.mock.calls)
    const onConnectionCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'connection')
    // emulate an RTCPeerConnection has been established
    const peerConnection = peer.connect('a_remote_peer_id')
    onConnectionCallback[1](peerConnection)
    // check that peerConnection callbacks were setup
    expect(peerConnection.on).toHaveBeenCalledTimes(3)
    // emulate peerConnection open
    const onPeerConnectionOpenCallback =
      peerConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'open')
    // emulate peerConnection.on('open')
    onPeerConnectionOpenCallback[1]()
    // check if PeerFetch instance has been created
    expect(PeerFetch).toHaveBeenCalledTimes(1)
    expect(PeerFetch).toHaveBeenCalledWith(peerConnection)
    const peerFetch = PeerFetch.mock.instances[0]
    expect(store.state.pnp.peerFetch).toBe(peerFetch)
    // check if the peer authentication sequence has been scheduled
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), 1000)
  })

  test('RTCPeerConnection "close" callback: RTCPeerConnection.on("close")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    console.debug('peer.on.mock.calls', peer.on.mock.calls)
    const onConnectionCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'connection')
    // emulate an RTCPeerConnection has been established
    const peerConnection = peer.connect('a_remote_peer_id')
    onConnectionCallback[1](peerConnection)
    // check that peerConnection callbacks were setup
    expect(peerConnection.on).toHaveBeenCalledTimes(3)
    // emulate peerConnection open
    const onPeerConnectionOpenCallback =
      peerConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'close')
    // emulate peerConnection.on('close')
    onPeerConnectionOpenCallback[1]()
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.userMessage).toEqual(expect.stringContaining('Connection to remote peer closed'))
    // check if the peer discovery sequence has been scheduled
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), 3000)
    // fast forward to discovery loop
    await jest.runOnlyPendingTimers()
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
  })

  test('RTCPeerConnection "error" callback: RTCPeerConnection.on("error")', async () => {
    await store.dispatch(PNP_SERVICE_CONNECT)
    const peer = store.state.pnp.peer
    console.debug('peer.on.mock.calls', peer.on.mock.calls)
    const onConnectionCallback = peer.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'connection')
    // emulate an RTCPeerConnection has been established
    const peerConnection = peer.connect('a_remote_peer_id')
    // emulate peerConnection remote peer has been assigned
    peerConnection.peer = 'a_remote_peer_id'
    onConnectionCallback[1](peerConnection)
    // check that peerConnection callbacks were setup
    expect(peerConnection.on).toHaveBeenCalledTimes(3)
    // emulate peerConnection open
    const onPeerConnectionOpenCallback =
      peerConnection.on.mock.calls.find(callbackDetails => callbackDetails[0] === 'error')
    // emulate peerConnection.on('error')
    onPeerConnectionOpenCallback[1]()
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.userMessage).toEqual(expect.stringContaining('Error in connection to remote peer ID'))
    // remote peer should be added to problematic list
    expect(store.state.pnp.problematicRemotePeers).toContain('a_remote_peer_id')
    // check if the peer discovery sequence has been scheduled
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), 3000)
    // fast forward to discovery loop
    await jest.runOnlyPendingTimers()
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
  })

  test('PEER_AUTHENTICATE with 200 response and authentication passing.', async () => {
    // emulate an RTCPeerConnection has been established
    const peerConnection = jest.fn()
    // emulate peerConnection remote peer has been assigned
    peerConnection.peer = 'a_remote_peer_id'
    // mock a peerfetch object
    const peerFetch = new PeerFetch()
    // mock return of expected successful authentication string
    jest.spyOn(PeerFetch.prototype, 'textDecode').mockImplementationOnce(
      (content) => {
        console.debug('mock textDecode', content)
        return 'Ambianic'
      }
    )
    store.state.pnp.peerFetch = peerFetch
    await store.dispatch(PEER_AUTHENTICATE, peerConnection)
    expect(peerFetch.get).toHaveBeenCalledTimes(1)
  })
})
