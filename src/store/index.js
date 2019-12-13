import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnp'
import { PNP_SERVICE_CONNECT } from './action-types.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isPNPInitialized: false,
    isEdgeConnected: false,
    isPNPServiceConnected: false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    pnp: PNPStore
  }
})

/**
  Begin connection attempt to Ambianic Edge as soon as the app is created
*/
store.dispatch(PNP_SERVICE_CONNECT)

export default store
