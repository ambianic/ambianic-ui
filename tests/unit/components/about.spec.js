import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import { cloneDeep } from 'lodash'
import About from '@/views/About.vue'
import { PEER_CONNECTED } from '@/store/mutation-types'
import EdgeDeviceStore from '@/store/edge-device.js'
import pnpStoreModule from '@/store/pnp'

describe('About Page', () => {
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify)
  localVue.use(VueX)

  let store
  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        edgeDeviceStore: cloneDeep(EdgeDeviceStore),
        pnp: cloneDeep(pnpStoreModule)
      }
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
    const localEdgeVersion = require('@/../package.json').version
    store.state.version = localEdgeVersion

    const component = mount(About, {
      localVue,
      vuetify,
      store
    })

    const versionElement = component.get('#version-element')
    expect(versionElement.find('#title').text()).toBe(localEdgeVersion)
  })

  test('edgeVersion is (re)fetched when a reconnection is made', async () => {
    await store.dispatch('FETCH_EDGE_DEVICE_DETAILS', { status: 'OK', version: '1.5' })
    store.state.version = '1.5'

    const versionElement = wrapper.get('#version-element')
    expect(versionElement.find('#title').text()).toBe('1.5')
  })
})
