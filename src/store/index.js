import Vue from 'vue'
import Vuex from 'vuex'
import PNPStore from './pnp.js'
import { INITIALIZE_PNP } from './action-types.js'
import { UPDATE_AVAILABLE } from './mutation-types'

Vue.use(Vuex)
let edgeDeviceVersion = require('@/../package.json').version

try {
  fetch('http://localhost:8778/api/status')
    .then((res) => res.json())
    .then((response) => {
      if (response.version && response.status === 'OK') {
        edgeDeviceVersion = response.version
      }
    })
    .catch((e) => {
      console.log(`Error getting version: ${e}`)
    })
} catch (e) {

}

const store = new Vuex.Store({
  state: {
    updateToBeInstalled: undefined,
    version: edgeDeviceVersion
  },
  mutations: {
    [UPDATE_AVAILABLE] (state, updateToBeInstalled) {
      state.updateToBeInstalled = updateToBeInstalled
    }
  },
  actions: {},
  modules: {
    pnp: PNPStore
  }
})

/**
  Begin connection attempt to Ambianic Edge as soon as the app is created
*/
store.dispatch(INITIALIZE_PNP)

export default store
