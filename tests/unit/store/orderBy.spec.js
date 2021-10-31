/**
 *
 * Test orderBy support
 *
 * ref: https://github.com/dumbmatter/fakeIndexedDB/issues/72
 *
 */
import Dexie from 'dexie'

/**
  * LocalDatabase API for browser indexeddb objects
  */
export const localdb = new Dexie('ambianic-database')

localdb.version(1).stores({
  // mydevices keeps information about user's list of managed edge devices
  // peerid is the primary key using each device's unique peerid
  // displayName is an index that makes sorting by displayName efficient
  myDevices: '&peerID, displayName'
})

/**
  * Edge device card properties
  */
export var EdgeDeviceCard = localdb.myDevices.defineClass({
  peerID: String,
  displayName: String,
  version: String
})

// Vuex store state
let state

/**
 *
 * Set the currently device card.
 *
 * @param {*} devicePeerID
 */
async function setCurrent ({ state }, devicePeerID) {
  console.debug('Setting current device card for peer ID:', devicePeerID)
  let current = state.allDeviceCards.get(devicePeerID)
  if (!current) {
    // if device card is no stored in indexeddb yet
    current = new EdgeDeviceCard()
    current.peerID = devicePeerID
  }
  state.currentDeviceCard = current
  console.debug('Set current device card to:', state.currentDeviceCard)
}

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
async function updateFromRemote ({ state }, edgeDetails) {
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
    // use Dexie put instead of update
    // in order to cover the case when a device card is not found in indexeddb
    console.debug('Putting localdb device card: ', { deviceCard })
    await localdb.myDevices.put(deviceCard)
    console.debug('Updated localdb device card: ', { deviceCard })
  }
}

async function devicesToArray () {
  const deviceCardArray = await localdb.myDevices.toArray()
  return deviceCardArray
}

async function devicesToArray2 () {
  const deviceCardArray = await localdb.myDevices.orderBy('displayName').toArray()
  return deviceCardArray
}

/**
 *
 * Load all stored EdgeDeviceCard objects into local state object
 */
async function syncState ({ state }, deviceCardArray) {
  console.debug({ deviceCardArray })
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

describe('localdb tests', () => {
  beforeEach(async () => {
    state = {
      // list of all user's device cards
      allDeviceCards: new Map(),
      // currently selected device card
      // for UI interaction
      // object of type EdgeDeviceCard
      currentDeviceCard: new EdgeDeviceCard()
    }

    await localdb.myDevices.clear()
  })

  afterEach(async () => {
  })

  // PASSES
  test('updateFromRemote mutates `currentDeviceCard.version` state', async () => {
    expect(state.currentDeviceCard.peerID).toBeFalsy()
    expect(state.currentDeviceCard.version).toBeFalsy()

    await await setCurrent({ state }, 'new_peerID')

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toBeFalsy()

    await updateFromRemote({ state }, {
      peerID: 'new_peerID',
      status: 'OK',
      version: '1.5.1'
    })

    const deviceCardArray = await devicesToArray()
    await syncState({ state }, deviceCardArray)

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toEqual('1.5.1')
  })

  // FAILS due to orderBy implementation
  // ref: https://github.com/dumbmatter/fakeIndexedDB/issues/72#issuecomment-955584976
  /**
  test('...Using orderBy and empty displayName.', async () => {
    expect(state.currentDeviceCard.peerID).toBeFalsy()
    expect(state.currentDeviceCard.version).toBeFalsy()

    await await setCurrent({ state }, 'new_peerID')

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toBeFalsy()

    await updateFromRemote({ state }, {
      peerID: 'new_peerID',
      status: 'OK',
      version: '1.5.1'
    })

    const deviceCardArray = await devicesToArray2()
    await syncState({ state }, deviceCardArray)

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toEqual('1.5.1')
  })
  */

  // PASSES
  test('...Using orderBy and non-empty displayName.', async () => {
    expect(state.currentDeviceCard.peerID).toBeFalsy()
    expect(state.currentDeviceCard.version).toBeFalsy()

    await await setCurrent({ state }, 'new_peerID')

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toBeFalsy()

    await updateFromRemote({ state }, {
      peerID: 'new_peerID',
      status: 'OK',
      version: '1.5.1',
      display_name: 'Front Door'
    })

    const deviceCardArray = await devicesToArray2()
    await syncState({ state }, deviceCardArray)

    expect(state.currentDeviceCard.peerID).toBe('new_peerID')
    expect(state.currentDeviceCard.version).toEqual('1.5.1')
    expect(state.currentDeviceCard.displayName).toEqual('Front Door')
  })
})
