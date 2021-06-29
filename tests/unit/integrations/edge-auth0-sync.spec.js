import { mount, createLocalVue } from '@vue/test-utils'
import Peer from 'peerjs'
import pnp from '@/store/pnp.js'
import { applicationStore } from '@/store/index.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '@/store/mutation-types'

import EdgeAuth0Sync from '@/components/edge-auth0-sync.vue'
import flushPromises from 'flush-promises'

jest.mock('peerjs')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('EdgeSyncModal', () => {
  let wrapper
  let store

  beforeEach(() => {
    pnp.peerFetch = jest.fn()

    Peer.mockClear()
    store = new Vuex.Store({
      state: cloneDeep(applicationStore.state),
      mutations: cloneDeep(applicationStore.mutations),
      actions: cloneDeep(applicationStore.actions),
      modules: cloneDeep(applicationStore.modules)
    })

    wrapper = mount(EdgeAuth0Sync, {
      store,
      localVue
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    wrapper.destroy()
  })

  test('It displays the notification dialog', () => {
    const dialog = wrapper.find('#notification-dialog')

    expect(wrapper.find('#close-icon').exists()).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    expect(dialog.exists()).toBe(true)
  })

  test('It displays compatibility checker state', () => {
    expect(wrapper.find('#compatibile-spinner').exists()).toBe(true)
    expect(wrapper.find('#checker-text').exists())
  })

  test('It sends edge device request to retrieve edge device details', async () => {
    const mock = jest.fn().mockReturnValue({ status: 'OK' })

    store.state.premiumService.user.sub = 'auth0|123456789'
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    wrapper.vm.edgeAPI.getEdgeStatus = mock

    mount(EdgeAuth0Sync, {
      store,
      localVue
    })

    await flushPromises()
    expect(mock).toHaveBeenCalled()
  })

  test('It handles compatible edge device versions', async () => {
    store.state.edgeVersion = '1.50'
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.premiumService.user.sub = 'auth0|123456789'

    await flushPromises()
    expect(wrapper.vm.EDGE_SYNC_COMPATIBILITY_STATUS).toBe('COMPATIBLE')
  })

  test('It handles outdated connected edge devices', async () => {
    store.state.premiumService.user.sub = 'auth0|123456789'
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.edgeVersion = '1'

    const component = mount(EdgeAuth0Sync, {
      store,
      localVue
    })

    await component.setData({ EDGE_SYNC_COMPATIBILITY_STATUS: 'OUTDATED' })

    expect(component.find('#outdated-icon').exists()).toBe(true)

    expect(component.find('#outdated-text').exists())
  })

  test('It displays sync loading state', async () => {
    await wrapper.setData({ EDGE_SYNC_COMPATIBILITY_STATUS: 'COMPATIBLE' })

    expect(wrapper.find('#loading-sync').exists()).toBe(true)

    expect(wrapper.find('#loading-explanation').exists())
  })

  test('It displays a sync granted state', async () => {
    await wrapper.setData({ isEdgeSynced: true, EDGE_SYNC_COMPATIBILITY_STATUS: 'COMPATIBLE' })

    expect(wrapper.find('#success-icon').exists()).toBe(true)

    const text = wrapper.find('#explanation')

    expect(text.exists()).toBe(true)

    await wrapper.find('#dismiss-button').trigger('click')
  })

  // point of test suite is to intentionally throw errors and ensure the catch blocks catch the error without closing modal
  test('Methods gracefully handle edge API errors in catch blocks', () => {
    wrapper.vm.edgeAPI = null

    wrapper.vm.fetchEdgeDetails()
    wrapper.vm.submitUserId()

    expect(wrapper.find('#notification-dialog').exists()).toBe(true)
  })
})
