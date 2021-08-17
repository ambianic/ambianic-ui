import { createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import { cloneDeep } from 'lodash'
import edgeDevice from '@/store/edge-device.js'
import { pnpStoreModule } from '@/store/pnp.js'
import { EDGE_DEVICE_DETAILS } from '@/store/mutation-types'

describe('Edge Device module', () => {
  const localVue = createLocalVue()

  let store

  // global
  localVue.use(VueX)

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        edgeDevice: cloneDeep(edgeDevice),
        pnp: cloneDeep(pnpStoreModule)
      }
    })
  })

  afterEach(() => {
  })

  test('Edge Device module contains empty `edgeSoftwareVersion` state', () => {
    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()
  })

  test('`EDGE_DEVICE_DETAILS` mutates `edgeSoftwareVersion` state', () => {
    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()

    store.commit(EDGE_DEVICE_DETAILS, {
      status: 'OK',
      version: '1.5.1'
    })

    expect(store.state.edgeDevice.edgeSoftwareVersion).toEqual('1.5.1')
  })

  test('`EDGE_DEVICE_DETAILS` ignores payload without `version` field', () => {
    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()

    store.commit(EDGE_DEVICE_DETAILS, {
      status: 'OK'
    })

    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()
  })

  test('`EDGE_DEVICE_DETAILS` ignores undefined payload', () => {
    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()

    store.commit(EDGE_DEVICE_DETAILS, {
      undefined
    })

    expect(store.state.edgeDevice.edgeSoftwareVersion).toBeFalsy()
  })
})
