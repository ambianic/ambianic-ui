import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { Auth0Plugin } from '@/auth'

describe('NavBar', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowshallowMount use
  localVue.use(VueX)

  const CLIENTDOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
  const CLIENTSECRET = process.env.VUE_APP_AUTH0_CLIENTID

  // AUTH0 PLUGIN
  Vue.use(Auth0Plugin, {
    CLIENTDOMAIN,
    CLIENTSECRET,
    onRedirectCallback: appState => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      )
    }
  })

  let store, state

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    state = {
      pnp: {
        peerConnectionStatus: jest.fn()
      }
    }

    store = new VueX.Store({
      state
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

  test('should load 5 buttons', () => {
    const btn = wrapper.findAll('.v-btn')
    expect(btn.length).toBe(5)
  })

  test('should load navigation drawer', () => {
    const nav = wrapper.find('.v-navigation-drawer')
    const item = wrapper.findAll('.v-list-item')

    expect(nav.exists()).toBe(true)
    expect(item.length).toBe(5)
  })
})
