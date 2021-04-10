import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import pnp from '@/store/pnp.js'
import {
  PEER_DISCONNECTED,
  PEER_CONNECTING,
  PEER_DISCOVERING,
  PEER_CONNECTED,
  PNP_SERVICE_DISCONNECTED,
  PNP_SERVICE_CONNECTING,
  PNP_SERVICE_CONNECTED
} from '@/store/mutation-types.js'
import {
  INITIALIZE_PNP,
  PNP_SERVICE_CONNECT,
  PNP_SERVICE_RECONNECT,
  PEER_DISCOVER
} from '@/store/action-types.js'
import { ambianicConf } from '@/config' // Peer is now a mock class
import Peer from 'peerjs'

jest.mock('peerjs')

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
    // console.debug("store:", store )
    // const state = store.state
    // console.debug("store.state:", { state } )
    Peer.mockClear()
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
    // jest.restoreAllMocks();
  })

  // test Vuex actions

  test('INITIALIZE_PNP on app start', () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    store.dispatch(INITIALIZE_PNP).then((res) => {
      expect(store.state.pnp.peerConnection).toBe(undefined)
      expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
      expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
      expect(store.state.pnp.peerFetch).toBe(undefined)
      expect(Peer).toHaveBeenCalledTimes(1)
      expect(Peer).toHaveBeenCalledWith(store.state.myPeerId,
        {
          host: ambianicConf.AMBIANIC_PNP_HOST,
          port: ambianicConf.AMBIANIC_PNP_PORT,
          secure: ambianicConf.AMBIANIC_PNP_SECURE,
          debug: 3
        })
    }).catch((err) => {
      console.log(err)
    })
  })

  test('PNP_SERVICE_CONNECT on app start', () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    store.dispatch(PNP_SERVICE_CONNECT).then((res) => {
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
    }).catch((err) => {
      console.log(err)
    })
  })

  test('PNP_SERVICE_RECONNECT assuming existing peer disconnected', () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate via mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some ID'
    store.state.pnp.myPeerId = 'some saved ID'
    store.dispatch(PNP_SERVICE_RECONNECT).then((res) => {
      expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
      expect(peer._lastServerId).toBe('some saved ID')
      expect(peer.reconnect).toHaveBeenCalledTimes(1)
    }).catch((err) => {
      console.log(err)
    })
  })

  test('PNP_SERVICE_RECONNECT when peer lost id', () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate via mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    store.state.pnp.myPeerId = 'some ID'
    peer.id = undefined
    store.dispatch(PNP_SERVICE_RECONNECT).then((res) => {
      expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
      expect(peer._id).toBe('some ID')
      expect(peer._lastServerId).toBe('some ID')
      expect(peer.reconnect).toHaveBeenCalledTimes(1)
    }).catch((err) => {
      console.log(err)
    })
  })

  test('PEER_DISCOVER when peer is connected', () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.dispatch(PEER_DISCOVER).then((res) => {
      expect(store.state.pnp.peerConnectionStatus).not.toBe(PEER_DISCOVERING)
      expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTED)
    }).catch((err) => {
      console.log(err)
    })
  })

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

  test('PEER_DISCOVER when peer is disconnected and local and remote peer ids are known', () => {
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate peer instance exists and local peer id is known
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some_ID'
    store.state.pnp.myPeerId = 'some_saved_ID'
    store.dispatch(PEER_DISCOVER).then((res) => {
      expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
      // wait a bit to let the test go through parts of the code
      // that run when the PNP service is disconnected

      // At this point in time, there should have been a single call to
      // setTimeout to schedule another peer discovery loop.
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), store.state.pnp.discoveryLoopPause)

      // emulate the use case when remotePeerId is already known
      // and connection is established
      store.state.pnp.remotePeerId = 'a_known_remote_peer_id'
      store.state.pnp.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
      // Fast forward and exhaust only currently pending timers
      // (but not any new timers that get created during that process)
      console.debug('jest running pending timers')
      jest.runOnlyPendingTimers()

      // give it a little time (20ms) for the next discovery loop to complete
      wait(20).then(() => {
        // There should not have been another loop.
        // The discovery process should have ended.
        expect(setTimeout).toHaveBeenCalledTimes(1)

        expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
      })
    }).catch((err) => {
      console.log(err)
    })
  })
})
