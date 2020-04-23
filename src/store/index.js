import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnp.js'

import { UPDATE_AVAILABLE } from './mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    updateToBeInstalled: undefined,
    version: require('@/../package.json').version
  },
  mutations: {
    [UPDATE_AVAILABLE] (state, updateToBeInstalled) {
      state.updateToBeInstalled = updateToBeInstalled
    }
  },
  actions: {
  },
  modules: {
    pnp: PNPStore
  }
})

export default store
