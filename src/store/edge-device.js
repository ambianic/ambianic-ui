import { EDGE_DEVICE_DETAILS, EDGE_DEVICE_DISPLAY_NAME } from './mutation-types'

const state = {
  edgeSoftwareVersion: null
}

const mutations = {
  [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
    if (edgeDetails) {
      if (edgeDetails.version) {
        state.edgeSoftwareVersion = edgeDetails.version
      }
      if (edgeDetails.displayName) {
        state.edgeDisplayName = edgeDetails.displayName
      }
    }
  },
  [EDGE_DEVICE_DISPLAY_NAME] (state, newDisplayName) {
    if (newDisplayName) {
      console.warn(`committing EDGE_DEVICE_DISPLAY_NAME: ${newDisplayName}`)
      state.edgeDisplayName = newDisplayName
    } else {
      throw new Error('Device Display Name cannot have an empty value')
    }
  }

}

const edgeDevice = {
  state,
  mutations
}

export default edgeDevice
