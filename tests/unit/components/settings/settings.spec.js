import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_DISCOVER } from '@/store/action-types'

describe('NavBar', () => {
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
      pnp: {
        peerConnectionStatus: jest.fn(),
        edgePeerId: jest.fn()
      }
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
})
