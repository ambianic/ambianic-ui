import {
  EDGE_DEVICE_DETAILS,
  EDGE_DEVICE_DISPLAY_NAME,
  EDGE_DEVICE_PEERID,
  EDGE_DEVICE_FORGET
} from './mutation-types'
import { localdb, EdgeDeviceCard } from './localdb'

const state = {
  edgeSoftwareVersion: undefined,
  edgeDisplayName: undefined
}

const mutations = {
  [EDGE_DEVICE_PEERID] (state, peerID) {
    state.peerID = peerID
  },
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
  },
  [EDGE_DEVICE_FORGET] (state) {
    state.peerID = undefined
    state.edgeDisplayName = undefined
    state.edgeSoftwareVersion = undefined
  }
}

const actions = {
  async setCurrent ({ commit }, devicePeerID) {
    commit(EDGE_DEVICE_PEERID, devicePeerID)
    const deviceCard = await localdb.myDevices.get(devicePeerID)
    // convert to the json format used on the wire
    if (deviceCard) {
      const edgeDetails = {
        version: deviceCard.edgeDisplayName,
        display_name: deviceCard.displayName
      }
      commit(EDGE_DEVICE_DETAILS, edgeDetails)
    }
  },
  async saveDetails ({ state, commit }, edgeDetails) {
    if (edgeDetails) {
      const deviceCard = new EdgeDeviceCard()
      deviceCard.peerID = state.peerID
      if (edgeDetails.version) {
        deviceCard.version = edgeDetails.version
      }
      if (edgeDetails.display_name) {
        deviceCard.displayName = edgeDetails.display_name
      }
      localdb.myDevices.update(state.peerID, deviceCard)
    }
    commit(EDGE_DEVICE_DETAILS, edgeDetails)
  },
  async saveDisplayName ({ commit }, displayName) {
    localdb.myDevices.update(state.peerID, { displayName })
    commit(EDGE_DEVICE_DISPLAY_NAME, displayName)
  },
  async forget ({ commit }) {
    commit(EDGE_DEVICE_FORGET)
  }
}

export const edgeDevice = {
  namespaced: true,
  state,
  mutations,
  actions
}
