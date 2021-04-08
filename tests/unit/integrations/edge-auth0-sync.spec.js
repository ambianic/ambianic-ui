import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import EdgeAuth0Sync from '../../../src/components/edge-auth0-sync.vue'

describe('AuthBarMenu', () => {
  // global
  let wrapper
  const localVue = createLocalVue()

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    // using shallowMount with subtree components
    wrapper = mount(EdgeAuth0Sync, {
      localVue,
      vuetify,
      router,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('It displays the modal dialog', () => {
    const dialog = wrapper.find('#dialog')
    expect(dialog.exists()).toBe(true)
  })

  test('It displays the pending card', () => {
    const card = wrapper.find('#pending')
    expect(card.exists()).toBe(true)
  })

  test('It displays the granted card', async () => {
    const component = mount(EdgeAuth0Sync)

    await component.setData({ syncState: 'GRANTED' })

    const card = component.find('#granted')
    expect(card.exists()).toBe(true)

    await component.find('#dismiss-button').trigger('click')
  })

  test('It displays the correct elements', () => {
    const card = wrapper.find('h2')
    expect(card.exists()).toBe(true)
    card.contains('Ambianic Edge', { matchCase: true })

    expect(wrapper.find('#spinner').exists()).toBe(true)
  })

  test('It displays verification_code and URL', async () => {
    const component = mount(EdgeAuth0Sync)

    await component.setData({
      verification_url: 'https://testing.com',
      user_code: '12121212'
    })

    expect(wrapper.find('#verification_code').exists()).toBe(true)
    expect(wrapper.find('#verification_url').exists()).toBe(true)
  })
})
