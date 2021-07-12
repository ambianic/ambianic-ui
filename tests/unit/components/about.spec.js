import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import { cloneDeep } from 'lodash'
import About from '@/views/About.vue'
import { PEER_CONNECTED } from '../../../src/store/mutation-types'
import { applicationStore } from '@/store/index.js'

describe('About Page', () => {
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify)
  localVue.use(VueX)

  let store
  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new VueX.Store({
      state: cloneDeep(applicationStore.state),
      modules: cloneDeep(applicationStore.modules),
      actions: cloneDeep(applicationStore.actions),
      mutations: cloneDeep(applicationStore.mutations)
    })

    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    wrapper = mount(About, {
      localVue,
      vuetify,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('edgeDevice details is retrieved from store', async () => {
    store.state.version = '1.2'

    const component = mount(About, {
      localVue,
      vuetify,
      store
    })

    const versionElement = component.get('#version-element')
    expect(versionElement.find('#title').text()).toBe('1.2')
  })

  test('edgeVersion is (re)fetched when a reconnection is made', async () => {
    await store.dispatch('FETCH_EDGE_DEVICE_DETAILS', { status: 'OK', version: '1.5' })
    store.state.version = '1.5'

    const versionElement = wrapper.get('#version-element')
    expect(versionElement.find('#title').text()).toBe('1.5')
  })
})
