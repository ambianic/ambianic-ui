/**
 * API to manage a database of user's known Ambianic Edge devices.
 */

import { localdb } from './localdb'

const state = {
}

const actions = {
  /**
   * Add to db info about a new device
   */
  async add (context, deviceCard) {
    return await this.myDevices.add(deviceCard)
  },
  /**
   * Update device properties
   */
  async update (context, deviceCard) {
    await this.myDevices.update(deviceCard.peerID, deviceCard)
  },
  /**
   * Forget information about a device given its peerID
   */
  async forget (context, peerID) {
    await this.myDevices.delete(peerID)
  }
}

const getters = {
  /**
   *
   * @returns an array of all stored EdgeDeviceCard objects
   */
  getAll (context) {
    localdb.myDevices.orderBy('displayName').toArray()
      .then((deviceCards) => deviceCards)
  },
  /**
   *
   * @returns the EdgeDeviceCard objects given a peerID.
   * Or it returns null if there is no record found.
   */
  get (context, peerID) {
    localdb.myDevices.get(peerID)
      .then((deviceCard) => deviceCard)
  }
}

export const myDevices = {
  namespaced: true,
  state,
  actions,
  getters
}
