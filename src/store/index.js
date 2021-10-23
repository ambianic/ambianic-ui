import Vue from 'vue'
import Vuex from 'vuex'
import { pnpStoreModule } from '@/store/pnp'
import { edgeDevice } from '@/store/edge-device'
import { myDevices } from '@/store/mydevices'
import { UPDATE_AVAILABLE } from '@/store/mutation-types'
import snackBarModule from '@/store/status-snackbar'

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
    edgeDevice: edgeDevice,
    myDevices: myDevices,
    snackBar: snackBarModule
  }
})

export default store
