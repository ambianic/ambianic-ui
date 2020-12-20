import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'

describe('NavBar', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  localVue.use(VueX)

  let store, state, getters
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
      friendlyName: jest.fn()
    }

    store = new VueX.Store({
      state,
      getters,
      mutations
    })

    // using shallowMount with subtree components
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
    expect(card.find('.v-card__title').text()).toBe('Ambianic Edge Connections')
    expect(card.exists()).toBe(true)
  })

  test('Previously connections', () => {
    const card = wrapper.find('.previously')
    expect(card.find('.v-card__title').text()).toBe('Previously connected Ambianic Edge')
    expect(card.exists()).toBe(true)
  })

  test('should load 2 buttons', () => {
    const btn = wrapper.findAll('.v-btn')
    expect(btn.length).toBe(2)
  })
})
