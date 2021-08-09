import { FETCH_EDGE_DEVICE_DETAILS } from './action-types.js'
import { EDGE_DEVICE_DETAILS } from './mutation-types'

const state = {
  version: require('@/../package.json').version
}

const mutations = {
  [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
    state.version = edgeDetails.version
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
