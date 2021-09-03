import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { pnpStoreModule } from '@/store/pnp'
import { PEER_CONNECTING, PEER_DISCONNECTED } from '@/store/mutation-types'

describe('NavBar', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowshallowMount use
  localVue.use(VueX)

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        pnp: pnpStoreModule
      }
    })

    // using shallowMount with subtree components
    wrapper = mount(NavBar, {
      localVue,
      vuetify,
      router,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('should load app bar', () => {
    const bar = wrapper.find('.v-app-bar')
    expect(bar.find('.v-toolbar__title').text()).toBe('Ambianic')
    expect(bar.exists()).toBe(true)
  })

  test('should load 4 buttons in nav bar: menu, timeline, connection and about', () => {
    const btns = wrapper.findAll('.v-btn')
    // we expect timeline, about, menu and connection buttons in nav bar
    expect(btns.length).toBe(4)
  })

  test('should load navigation drawer', () => {
    const nav = wrapper.find('.v-navigation-drawer')
    const item = wrapper.findAll('.v-list-item')

    expect(nav.exists()).toBe(true)
    expect(item.length).toBe(5)
  })

  test('`peerConnectionStatus` changes ConnectionStatusIcon icon', () => {
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    expect(wrapper.find('#cloud-off-outline').exists()).toBeTruthy()

    store.state.pnp.peerConnectionStatus = PEER_CONNECTING
    const newComponent = wrapper = mount(NavBar, {
      localVue,
      vuetify,
      router,
      store
    })

    expect(newComponent.find('#cloud-sync-outline').exists()).toBeTruthy()
  })
})
