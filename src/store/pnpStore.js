import { wrtcPeer } from '@/remote/pnpRemote'
import { PEER_CONNECTED, PEER_DISCONNECTED,
         PNP_SERVICE_CONNECTED, PNP_SERVICE_DISCONNECTED }
         from './mutation-types.js'

const STORAGE_KEY = 'ambianic-pnp'

const state = {
  /**
    settings store persistent infromation such as
    WebRTC clientIds for this Ambianic UI instance and its
    remote Ambianic Edge peer.
  */
  settings: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'),
  /**
    Reference to the PeerJS instance active
    in the current global application scope (i.e. window scope).
  */
  peer: wrtcPeer(),
  /**
    Status of current peer connection to remote peer
  */
  peerConnectionStatus: PEER_DISCONNECTED,
  /**
    Status of current peer connection to remote pnp service
  */
  pnpServiceConnectionStatus: PNP_SERVICE_DISCONNECTED
}

const mutations = {
  [PEER_CONNECTED] (state, todo) {
    state.peerConnectionStatus = PEER_CONNECTED
  },
  [PEER_DISCONNECTED] (state, todo) {
    state.peerConnectionStatus = PEER_DISCONNECTED
  },
  [PNP_SERVICE_CONNECTED] (state, todo) {
    state.pnpServiceConnectionStatus = PNP_SERVICE_CONNECTED
  },
  [PNP_SERVICE_DISCONNECTED] (state, todo) {
    state.pnpServiceConnectionStatus = PNP_SERVICE_DISCONNECTED
  }
}

const actions = {
  connect ({ commit }, text) {
    commit('addTodo', {
      uid: Date.now(),
      text,
      done: false
    })
  },
  disconnect ({ commit }, todo) {
    commit('removeTodo', todo)
  },
  reconnect ({ commit }, todo) {
    commit('editTodo', { todo, done: !todo.done })
  }
}

/**
Persist in local browser storage each time pnp settings change
*/
const plugins = [store => {
  store.subscribe((mutation, { settings }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  })
}]

export default {
  state,
  mutations,
  actions,
  plugins
}
