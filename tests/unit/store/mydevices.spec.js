import { createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import { cloneDeep } from 'lodash'
import { pnpStoreModule } from '@/store/pnp.js'
import { myDevicesStoreModule } from '@/store/mydevices'

describe('MyDevices module', () => {
  const localVue = createLocalVue()

  let store

  // global
  localVue.use(VueX)

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        myDevices: cloneDeep(myDevicesStoreModule),
        pnp: cloneDeep(pnpStoreModule)
      }
    })
  })

  afterEach(() => {
  })

  test('Edge Device module contains empty `edgeSoftwareVersion` state', () => {
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()
  })

  test('myDevices/setCurrent mutates `currentDeviceCard` state', async () => {
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()
    await store.dispatch('myDevices/setCurrent', 'new_peerID')
    expect(store.state.myDevices.currentDeviceCard.peerID).toBe('new_peerID')
  })

  test('myDevices/updateFromRemote mutates `currentDeviceCard.version` state', async () => {
    expect(store.state.myDevices.currentDeviceCard.peerID).toBeFalsy()
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()

    await store.dispatch('myDevices/setCurrent', 'new_peerID')

    expect(store.state.myDevices.currentDeviceCard.peerID).toBe('new_peerID')
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()

    await store.dispatch('myDevices/updateFromRemote', {
      peerID: 'new_peerID',
      status: 'OK',
      version: '1.5.1'
    })

    expect(store.state.myDevices.currentDeviceCard.peerID).toBe('new_peerID')
    expect(store.state.myDevices.currentDeviceCard.version).toEqual('1.5.1')
  })

  test('myDevices/updateFromRemote ignores payload without `version` field', async () => {
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()

    await store.dispatch('myDevices/updateFromRemote', {
      peerID: 'somePeerID',
      status: 'OK'
    })

    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()
  })

  test('myDevices/updateFromRemote ignores undefined payload', async () => {
    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()

    await store.dispatch('myDevices/updateFromRemote', undefined)

    expect(store.state.myDevices.currentDeviceCard.version).toBeFalsy()
  })
})
