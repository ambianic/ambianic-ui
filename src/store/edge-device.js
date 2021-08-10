import { FETCH_EDGE_DEVICE_DETAILS } from './action-types.js'
import { EDGE_DEVICE_DETAILS } from './mutation-types'

const state = {
  edgeSoftwareVersion: null
}

const mutations = {
  [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
    state.edgeSoftwareVersion = edgeDetails.version
  }
}

const actions = {
  [FETCH_EDGE_DEVICE_DETAILS] ({ commit }, details) {
    commit(EDGE_DEVICE_DETAILS, details)
  }
}

const edgeDevice = {
  state,
  actions,
  mutations
}

export default edgeDevice
