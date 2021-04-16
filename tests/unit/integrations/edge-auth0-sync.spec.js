import { mount, createLocalVue } from '@vue/test-utils'
import Peer from 'peerjs'
import pnp from '@/store/pnp.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'

import EdgeAuth0Sync from '../../../src/components/edge-auth0-sync.vue'

jest.mock('peerjs')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('AuthBarMenu', () => {
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

  test('It displays the modal dialog', () => {
    const dialog = wrapper.find('#dialog')
    expect(dialog.find('#dialog').isVisible()).toBe(true)

    expect(dialog.exists()).toBe(true)
  })

  test('It displays the pending card', () => {
    const card = wrapper.find('#pending')
    expect(card.exists()).toBe(true)
  })

  test('It displays the granted card', async () => {
    const component = mount(EdgeAuth0Sync, {
      store, localVue
    })

    await component.setData({ syncState: 'GRANTED' })

    const card = component.find('#granted')
    expect(card.exists()).toBe(true)
    expect(component.find('#success').exists()).toBe(true)

    await component.find('#dismiss-button').trigger('click')
  })

  test('It displays the correct elements', () => {
    const card = wrapper.find('h3')
    expect(card.exists()).toBe(true)
    card.contains('Ambianic Edge', { matchCase: true })

    expect(wrapper.find('#spinner').exists()).toBe(true)
  })

  test('It displays a verification_code and URL', async () => {
    const component = mount(EdgeAuth0Sync, {
      store, localVue
    })

    await component.setData({
      verification_url: 'https://testing.com',
      user_code: '12121212'
    })

    expect(component.find('#verification_code').exists()).toBe(true)
    expect(component.find('#verification_url').exists()).toBe(true)
  })
})
