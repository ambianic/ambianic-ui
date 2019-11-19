import { openDB } from 'idb'

const dbPromise = openDB('ambianic-keyval-store', 1, {
  upgrade (db) {
    db.createObjectStore('settings')
    console.log('db upgrade invoked')
  }
})

export const settingsDB = {
  async get (key) {
    return (await dbPromise).get('settings', key)
  },
  async set (key, val) {
    return (await dbPromise).put('settings', val, key)
  },
  async delete (key) {
    return (await dbPromise).delete('settings', key)
  },
  async clear () {
    return (await dbPromise).clear('settings')
  },
  async keys () {
    return (await dbPromise).getAllKeys('settings')
  }
}
