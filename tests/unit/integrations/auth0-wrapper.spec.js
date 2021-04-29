import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin } from '@/auth'

const Component = {
  template: `
    <div>
    <button id="login" @click="$auth.loginWithRedirect()"> Login </button>
    <p id="client"> {{ $auth.auth0Client }} </p>
    <button id="logout" @click="$auth.$auth.logout({
      returnTo: window.location.origin
    })"> Login </button>
    </div>
  `
}

describe('Auth0Wrapper', () => {
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
    onRedirectCallback: (appState) => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      )
    }
  })

  let store, state, getters

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
      state,
      getters
    })

    // using shallowMount with subtree components
    wrapper = mount(Component, {
      localVue,
      vuetify,
      router,
      store,
      methods: {}
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('It contains auth0 methods', async () => {
    expect(wrapper.find('#login').exists()).toBe(true)
    expect(wrapper.find('#client').exists()).toBe(true)
    expect(wrapper.find('#logout').exists()).toBe(true)
  })
})
