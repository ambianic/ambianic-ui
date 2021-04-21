import { mount, createLocalVue } from '@vue/test-utils'
import Peer from 'peerjs'
import pnp from '@/store/pnp.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

import EdgeAuth0Sync from '../../../src/components/edge-auth0-sync.vue'

jest.mock('peerjs')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('EdgeSyncModal', () => {
  let wrapper
  let store

  beforeEach(() => {
    Peer.mockClear()
    // mocking window.RTCPeerConnection
    store = new Vuex.Store({ modules: { pnp: cloneDeep(pnp) } })

    wrapper = mount(EdgeAuth0Sync, {
      store,
      localVue
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

  test('It displays a sync granted state', async () => {
    await wrapper.setData({ isEdgeSynced: true })

    expect(wrapper.find('#success-icon').exists()).toBe(true)

    const text = wrapper.find('#explanation')

    expect(text.exists()).toBe(true)

    await wrapper.find('#dismiss-button').trigger('click')
  })
})
