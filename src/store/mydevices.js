/**
 * API to manage a database of user's known Ambianic Edge devices.
 */

import { EdgeDeviceCard, localdb } from './localdb'

const state = {
  // list of all user's device cards
  allDeviceCards: new Map(),
  // currently selected device card
  // for UI interaction
  // object of type EdgeDeviceCard
  currentDeviceCard: undefined
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
  async update ({ dispatch }, deviceCard) {
    await localdb.myDevices.update(deviceCard.peerID, deviceCard)
    // refresh vuex state
    await dispatch('syncState')
  },
  /**
   * Forget(delete) a local device card
   * @param peerID id of the device card to be deleted
   */
  async forget ({ dispatch }, peerID) {
    console.debug('forget() -> ', { peerID })
    await localdb.myDevices.delete(peerID)
    // refresh vuex state
    await dispatch('syncState')
  },
  /**
   *
   * Set the currently device card.
   *
   * @param {*} devicePeerID
   */
  async setCurrent ({ state }, devicePeerID) {
    console.debug('Setting current device card for peer ID:', devicePeerID)
    state.currentDeviceCard = state.allDeviceCards.get(devicePeerID)
    console.debug('Set current device card to:', state.currentDeviceCard)
  },
  /**
   *
   * Update card info based on data
   * reveived from a remote edge device.
   *
   * This covers the scenario where user A updates
   * a card's Display Name and saves it on the edge device.
   * Then user B' UI app fetches the updated name from the same device
   * and updates its localdb.
   *
   * @param {*} edgeDetails in json format
   */
  async updateFromRemote ({ state, dispatch }, edgeDetails) {
    console.debug('Updating local state from remote json payload: ', { edgeDetails })
    if (edgeDetails) {
      const deviceCard = new EdgeDeviceCard()
      deviceCard.peerID = edgeDetails.peerID
      if (edgeDetails.version) {
        deviceCard.version = edgeDetails.version
      }
      if (edgeDetails.display_name) {
        deviceCard.displayName = edgeDetails.display_name
      }
      localdb.myDevices.update(edgeDetails.peerID, deviceCard)
      // refresh vuex state
      await dispatch('syncState')
    }
  },
  async updateDisplayName ({ state, dispatch }, { peerID, displayName }) {
    console.debug('Updating display name: ', { peerID, displayName })
    if (displayName) {
      await localdb.myDevices.update(peerID, { displayName: displayName })
      console.debug('saved new display name for peer ID', { peerID, displayName })
    } else {
      throw new Error('Device Display Name cannot have an empty value')
    }
    // refresh vuex state
    await dispatch('syncState')
  },
  /**
   *
   * Load all stored EdgeDeviceCard objects into local state object
   */
  async syncState ({ state }) {
    const deviceCardArray = await localdb.myDevices.orderBy('displayName').toArray()
    // convery array to a hashmap
    const deviceCardMap = deviceCardArray.reduce(
      function (map, deviceCard) {
        map.set(deviceCard.peerID, deviceCard)
        return map
      },
      new Map()
    )
    state.allDeviceCards = deviceCardMap
    // refresh current card info from db's latest snapshot we just pulled
    if (state.currentDeviceCard && state.currentDeviceCard.peerID) {
      state.currentDeviceCard = deviceCardMap.get(state.currentDeviceCard.peerID)
    }
    const currentDeviceCard = state.currentDeviceCard
    console.debug('syncState() -> ', { deviceCardArray, deviceCardMap, currentDeviceCard })
  }
}

export const myDevices = {
  namespaced: true,
  state,
  actions
}
