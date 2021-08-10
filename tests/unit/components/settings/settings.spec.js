import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import edgeDevice from '@/store/edge-device.js'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '@/store/mutation-types.js'
import { pnpStoreModule } from '../../../../src/store/pnp'

describe('Settings', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  localVue.use(VueX)

  let store, state, getters, actions
  const mutations = {
    testMutation: jest.fn()
  }

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    state = {
      pnp: cloneDeep(pnpStoreModule),
      // pnp: {
      //   peerConnectionStatus: jest.fn(),
      //   edgePeerId: jest.fn()
      // },
      edgeDevice: cloneDeep(edgeDevice)
    }

    getters = {
    //   ...
    }

    actions = {
      [PEER_DISCOVER] (context) {
      }
    }

    store = new VueX.Store({
      state,
      getters,
      mutations,
      actions
    })

    // using mount with subtree components
    wrapper = mount(Settings, {
      localVue,
      vuetify,
      router,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
  test('Connection details loaded', () => {
    const card = wrapper.find('.v-card')
    expect(card.find('.v-card__title').text()).toBe('Ambianic Edge connection details')
    expect(card.exists()).toBe(true)
  })

  test('should have Discover Local button', () => {
    const btn = wrapper.find('#btn-discoverLocal')
    expect(btn.exists()).toBe(true)
  })

  test('should have Pair Remotely button', () => {
    const btn = wrapper.find('#btn-sendRemotePeerID')
    expect(btn.exists()).toBe(true)
  })

  test('Connected Edge device version is shown', () => {
    const localEdgeVersion = '2.50.5'

    const newStore = new VueX.Store({
      modules: {
        pnp: cloneDeep(pnpStoreModule),
        edgeDevice: cloneDeep(edgeDevice)
      }
    })

    newStore.state.edgeDevice.edgeSoftwareVersion = localEdgeVersion
    newStore.state.pnp.peerConnectionStatus = PEER_CONNECTED
    newStore.state.pnp.remotePeerId = '1234-1234-1234-1234-1234'

    const component = mount(Settings, {
      localVue,
      vuetify,
      router,
      store: newStore
    })

    const versionElement = component.get('#version-element')
    expect(versionElement.find('#title').text()).toBe(localEdgeVersion)
  })
})
