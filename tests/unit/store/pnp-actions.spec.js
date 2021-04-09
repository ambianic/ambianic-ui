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

  test('INITIALIZE_PNP', () => {
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
      console.error({ err })
    })
  })

})
