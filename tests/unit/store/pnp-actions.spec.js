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

jest.mock('peerjs'); // Peer is now a mock class
import Peer from 'peerjs'

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
  })

  afterEach(() => {
  })
  
  // test Vuex actions

  test('INITIALIZE_PNP on app start', () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    store.dispatch(INITIALIZE_PNP).then( (res) => {
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
    }).catch( (err) => {
      fail( err )
    })
  })

  test('PNP_SERVICE_CONNECT on app start', () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    store.dispatch(PNP_SERVICE_CONNECT).then( (res) => {
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
    }).catch( (err) => {
      fail( err )
    })
  })

  test('PNP_SERVICE_RECONNECT assuming existing peer disconnected', () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate a mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    peer.id = 'some ID'
    store.state.pnp.myPeerId = 'some saved ID'
    store.dispatch(PNP_SERVICE_RECONNECT).then( (res) => {
      expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
      expect(peer._lastServerId).toBe('some saved ID')
      expect(peer.reconnect).toHaveBeenCalledTimes(1)
    }).catch( (err) => {
      fail( err )
    })
  })

  test('PNP_SERVICE_RECONNECT when peer lost id', () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate a mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    store.state.pnp.myPeerId = 'some ID'
    peer.id = undefined
    store.dispatch(PNP_SERVICE_RECONNECT).then( (res) => {
      expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTING)
      expect(peer._id).toBe('some ID')
      expect(peer._lastServerId).toBe('some ID')
      expect(peer.reconnect).toHaveBeenCalledTimes(1)
    }).catch( (err) => {
      fail( err )
    })
  })

  test('PNP_SERVICE_RECONNECT when peer is already connected', () => {
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
    // emulate a mock Peer instance
    const peer = new Peer()
    store.state.pnp.peer = peer
    // emulate that peer is connected
    peer.open = true
    store.dispatch(PNP_SERVICE_RECONNECT).then( (res) => {
      expect(peer.reconnect).toHaveBeenCalledTimes(0)
    }).catch( (err) => {
      fail( err )
    })
  })
})
