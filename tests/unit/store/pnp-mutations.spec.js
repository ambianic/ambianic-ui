import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { cloneDeep } from 'lodash'
import pnp from '@/store/pnp.js'
import {
  PEER_NEW_INSTANCE,
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
const STORAGE_KEY = 'ambianic-pnp-settings'

describe('PnP state machine mutations - p2p communication layer', () => {
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
    const state = store.state
    // console.debug("store.state:", { state } )
  })

  afterEach(() => {
  })
  
  // test Vuex mutations

  test('PEER_NEW_INSTANCE', () => {
    expect(store.state.pnp.peer).toBe(undefined)
    store.commit(PEER_NEW_INSTANCE, 'a new peer instance')
    expect(store.state.pnp.peer).toBe('a new peer instance')
  })

  test('PEER_DISCONNECTED', () => {
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
    store.commit(PEER_DISCONNECTED)
    expect(store.state.pnp.peerConnection).toBe(undefined)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    expect(store.state.pnp.peerFetch).toBe(undefined)
  })

  test('PEER_DISCOVERED', () => {
    store.commit(PEER_DISCONNECTED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.commit(PEER_DISCOVERED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERED)
  })

  test('PEER_DISCOVERING', () => {
    store.commit(PEER_DISCONNECTED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.commit(PEER_DISCOVERING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCOVERING)
  })

  test('PEER_CONNECTING', () => {
    store.commit(PEER_DISCONNECTED)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    store.commit(PEER_CONNECTING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
  })

  test('PEER_AUTHENTICATING', () => {
    store.commit(PEER_CONNECTING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
    store.commit(PEER_AUTHENTICATING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_AUTHENTICATING)
  })

  test('PEER_CONNECTED', () => {
    store.commit(PEER_CONNECTING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
    store.commit(PEER_CONNECTED, 'a peerConnection')
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTED)
    expect(store.state.pnp.peerConnection).toBe('a peerConnection')
  })

  test('PEER_CONNECTION_ERROR', () => {
    store.commit(PEER_CONNECTING)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTING)
    store.commit(PEER_CONNECTION_ERROR)
    expect(store.state.pnp.peerConnectionStatus).toBe(PEER_CONNECTION_ERROR)
  })

  test('PNP_SERVICE_DISCONNECTED', () => {
    store.commit(PNP_SERVICE_DISCONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_DISCONNECTED)
  })

  test('PNP_SERVICE_CONNECTED', () => {
    store.commit(PNP_SERVICE_CONNECTED)
    expect(store.state.pnp.pnpServiceConnectionStatus).toBe(PNP_SERVICE_CONNECTED)
  })

  test('USER_MESSAGE', () => {
    store.commit(USER_MESSAGE, 'a user message')
    expect(store.state.pnp.userMessage).toBe('a user message')
  })

  test('NEW_PEER_ID', () => {
    store.commit(NEW_PEER_ID, 'a new peer id')
    expect(store.state.pnp.myPeerId).toBe('a new peer id')
  })

  test('NEW_REMOTE_PEER_ID', () => {
    store.commit(NEW_REMOTE_PEER_ID, 'a new remote peer id')
    expect(store.state.pnp.remotePeerId).toBe('a new remote peer id')
    expect(window.localStorage.getItem(`${STORAGE_KEY}.remotePeerId`)).toBe('a new remote peer id')
  })

  test('REMOTE_PEER_ID_REMOVED', () => {
    store.commit(REMOTE_PEER_ID_REMOVED)
    expect(store.state.pnp.remotePeerId).toBe(undefined)
    expect(window.localStorage.getItem(`${STORAGE_KEY}.remotePeerId`)).toBe(null)
  })

  test('PEER_FETCH', () => {
    store.commit(PEER_FETCH, 'a peerFetch instance')
    expect(store.state.pnp.peerFetch).toBe('a peerFetch instance')
  })

  test('getter isEdgeConnected', () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    console.debug('store.getters', store.getters)
    expect(store.getters.isEdgeConnected).toBeTruthy()
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    expect(store.getters.isEdgeConnected).toBeFalsy()
  })

})
