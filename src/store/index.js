import Vue from 'vue'
import Vuex from 'vuex'
import { pnpStoreModule } from './pnp.js'
import edgeDevice from './edge-device'
// import { INITIALIZE_PNP } from './action-types.js'
import { UPDATE_AVAILABLE } from './mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    updateToBeInstalled: undefined,
    uiAppVersion: require('@/../package.json').version
  },
  mutations: {
    [UPDATE_AVAILABLE] (state, updateToBeInstalled) {
      state.updateToBeInstalled = updateToBeInstalled
    }
  },
  actions: {
  },
  modules: {
    pnp: pnpStoreModule,
    edgeDevice: edgeDevice
  }
})

/**
 *
 * UPDATE (Aug 2021): turning off auto-init due to Lighthouse performance issues for PWA home screen.
 *
 * Begin connection attempt to Ambianic Edge as soon as the app is created.

  store.dispatch(INITIALIZE_PNP)
*/

export default store
