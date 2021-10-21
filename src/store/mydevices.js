/**
 * API to manage a database of user's known Ambianic Edge devices.
 */

import { LocalDatabase } from './localdb'
import { EDGE_DEVICE_DETAILS, EDGE_DEVICE_DISPLAY_NAME } from './mutation-types'

/**
 * Edge device card properties
 */
class EdgeDeviceCard {
  peerID
  displayName
  version
}

/**
 * API for convenient access to mydevices data stored in
 * browser local indexeddb.
 */
class MyDevicesDAO {
  constructor() {
    this.mydevicesTable = new LocalDatabase().mydevices
  }
}

const state = {
  // data access object pattern
  dao: new MyDevicesDAO(),
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

const getters = {
  /**
   *
   * Return a list with information about all of user's managed edge devices.
   * @returns a list of EdgeDeviceCard objects
   */
  getAll (state, getters) {
    state.dao.getAll().then((list) => list)
  },
  /**
   * Add to db info about a new device
   */
  add (state, getters) {
    // ...
  },
  /**
   * Get detailed info about a device by its peerID
   */
   get (state, getters, peerID) {
    // ...
  },
  /**
   * Update device properties
   */
   update (state, getters, deviceCard) {
    // ...
  },
  /**
   * Forget information about a device given its peerID
   */
   forget (state, getters, peerID) {
    // ...
  },
}

const myDevices = {
  state,
  mutations,
  getters
}

export default myDevices
