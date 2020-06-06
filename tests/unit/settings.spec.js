import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '../../src/views/Settings.vue'

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
    //   ...
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
    expect(card.find('.v-card__title').text()).toBe('Ambianic Edge connection details')
    expect(card.exists()).toBe(true)
  })
  
  /**
   * These tests are under construction. Need to mock Edge's in Vuex
   */
  // test('Connection Status', () => {

  //   const edgeAddress = '5568ec87-42d8-47b0-aeea-01a125db0623'
  //   // state.pnp.edgeAddress = edgeAddress

  //   expect(this.mutations.testMutation).toHaveBeenCalledWith({},{})
  // })


//   test('should load 5 buttons', () => {
//     const btn = wrapper.findAll('.v-btn')
//     expect(btn.length).toBe(5)
//   })

//   test('should load navigation drawer', () => {
//     const nav = wrapper.find('.v-navigation-drawer')
//     const item = wrapper.findAll('.v-list-item')

//     expect(nav.exists()).toBe(true)
//     expect(item.length).toBe(5)
//   })
})
