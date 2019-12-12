import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnpStore.js'

Vue.use(Vuex)

export default new Vuex.Store({
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
