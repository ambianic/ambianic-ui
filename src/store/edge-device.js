import { EDGE_DEVICE_DETAILS, EDGE_DEVICE_DISPLAY_NAME } from './mutation-types'

const state = {
  edgeSoftwareVersion: undefined,
  edgeDisplayName: undefined
}

const mutations = {
  [EDGE_DEVICE_DETAILS] (state, edgeDetails) {
    if (edgeDetails) {
      if (edgeDetails.version) {
        state.edgeSoftwareVersion = edgeDetails.version
      }
      if (edgeDetails.display_name) {
        state.edgeDisplayName = edgeDetails.display_name
      }
    }
  },
  [EDGE_DEVICE_DISPLAY_NAME] (state, newDisplayName) {
    if (newDisplayName) {
      console.debug(`committing EDGE_DEVICE_DISPLAY_NAME: ${newDisplayName}`)
      state.edgeDisplayName = newDisplayName
    } else {
      throw new Error('Device Display Name cannot have an empty value')
    }
  }

}

export const edgeDevice = {
  state,
  mutations
}
