import { mount, createLocalVue } from '@vue/test-utils'
import Peer from 'peerjs'
import pnp from '@/store/pnp.js'
import premium from '@/store/premium-service.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '@/store/mutation-types'
import { PEER_DISCOVER } from '@/store/action-types'

import EdgeAuth0Sync from '@/components/edge-auth0-sync.vue'

jest.mock('peerjs')

const localVue = createLocalVue()
localVue.use(Vuex)

const methods = {
  submitUserId: jest.fn(),
  handleClose: jest.fn()
}

describe('EdgeSyncModal', () => {
  let wrapper
  let store

  beforeEach(() => {
    Peer.mockClear()
    // mocking window.RTCPeerConnection
    store = new Vuex.Store({
      modules: {
        pnp: cloneDeep(pnp),
        premiumService: cloneDeep(premium)
      }
    })

    wrapper = mount(EdgeAuth0Sync, {
      store,
      localVue,
      methods
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('It displays the notification dialog', () => {
    const dialog = wrapper.find('#notification-dialog')

    expect(wrapper.find('#close-icon').exists()).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    expect(dialog.exists()).toBe(true)
  })

  test('It displays loading state', () => {
    expect(wrapper.find('#loading-sync').exists()).toBe(true)

    expect(wrapper.find('#loading-explanation').exists())
  })

  test('It sends edge device request to sync', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '917d5f0a-6469-4d33-b5c2-efd858118b74'

    await store.dispatch(PEER_DISCOVER)

    expect(methods.submitUserId).toHaveBeenCalledTimes(1)
  })

  test('It displays a sync granted state', async () => {
    await wrapper.setData({ isEdgeSynced: true })

    expect(wrapper.find('#success-icon').exists()).toBe(true)

    const text = wrapper.find('#explanation')

    expect(text.exists()).toBe(true)

    await wrapper.find('#dismiss-button').trigger('click')

    expect(methods.handleClose).toHaveBeenCalledTimes(1)
  })
})
