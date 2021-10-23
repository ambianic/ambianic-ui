/**
 * API to manage a database of user's known Ambianic Edge devices.
 */

import { localdb } from './localdb'

const state = {
  // list of all user's device cards
  allDeviceCards: {}
}

const actions = {
  /**
   * Add to db info about a new device
   */
  async add (context, deviceCard) {
    console.debug('add() called', { deviceCard })
    const recordId = await localdb.myDevices.add(deviceCard)
    console.debug('add() success.', { deviceCard, recordId })
    return recordId
  },
  /**
   * Update device properties
   */
  async update (context, deviceCard) {
    await localdb.myDevices.update(deviceCard.peerID, deviceCard)
  },
  /**
   * Forget(delete) a local device card
   * @param peerID id of the device card to be deleted
   */
  async forget (context, peerID) {
    console.debug('forget() -> ', { peerID })
    await localdb.myDevices.delete(peerID)
  },
  /**
   *
   * Load all stored EdgeDeviceCard objects into local state object
   */
  async loadAll ({ state }) {
    const deviceCardArray = await localdb.myDevices.orderBy('displayName').toArray()
    // convery array to a hashmap
    const deviceCardMap = deviceCardArray.reduce(
      function (map, deviceCard) {
        map[deviceCard.peerID] = deviceCard
        return map
      },
      {}
    )
    console.debug('getAll() -> ', { deviceCardArray, deviceCardMap })
    state.allDeviceCards = deviceCardMap
  }
}

export const myDevices = {
  namespaced: true,
  state,
  actions
}
