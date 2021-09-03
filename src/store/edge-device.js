import { EDGE_DEVICE_DETAILS } from './mutation-types'

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
  }
}

const edgeDevice = {
  state,
  mutations
}

export default edgeDevice
