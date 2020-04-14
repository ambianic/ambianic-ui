import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnp.js'
import { INITIALIZE_PNP } from './action-types.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    version: require('@/../package.json').version
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
store.dispatch(INITIALIZE_PNP)

export default store
