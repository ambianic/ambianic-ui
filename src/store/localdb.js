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
  notificationsEnabled: Boolean,
  version: String
})
