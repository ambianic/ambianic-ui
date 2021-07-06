import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnp.js'
import PremiumServiceStore from './premium-service'
import { FETCH_EDGE_DEVICE_DETAILS, INITIALIZE_PNP } from './action-types.js'
import { UPDATE_AVAILABLE, EDGE_DEVICE_DETAILS } from './mutation-types'

Vue.use(Vuex)

const applicationStore = {
  state: {
    updateToBeInstalled: undefined,
    edgeVersion: require('@/../package.json').version
  },
  mutations: {
    [UPDATE_AVAILABLE] (state, updateToBeInstalled) {
      state.updateToBeInstalled = updateToBeInstalled
    },
    [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
      state.edgeVersion = edgeDetails.version
    }
  },
  actions: {
    [FETCH_EDGE_DEVICE_DETAILS] ({ commit }, details) {
      commit(EDGE_DEVICE_DETAILS, details)
    }
  },
  modules: {
    pnp: PNPStore,
    premiumService: PremiumServiceStore
  }
}

const store = new Vuex.Store(applicationStore)

/**
  Begin connection attempt to Ambianic Edge as soon as the app is created
*/
store.dispatch(INITIALIZE_PNP)

export { store, applicationStore }
