import { EDGE_DEVICE_DETAILS } from './mutation-types'

const state = {
  edgeSoftwareVersion: null
}

const mutations = {
  [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
    console.log(edgeDetails, 'EDGE STORE \n \n \n \n \n')

    if (edgeDetails.version) {
      state.edgeSoftwareVersion = edgeDetails.version
    }
  }
}

const edgeDevice = {
  state,
  mutations
}

export default edgeDevice
