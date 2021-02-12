import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin } from '@/auth'

const Component = {
  template: `
    <div>
      <span id="authenticated">{{ $auth.isAuthenticated }}</span>
      <span id="loading">{{ $auth.loading }}</span>
      <span id="user">{{ $auth.user }}</span>
    </div>
  `
}

describe('AuthBarMenu', () => {
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
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  // find a way to convert to BOOL values
  test('It should have initial authentication & user state', () => {
    expect(wrapper.find('#authenticated').text()).toBe('false')
    expect(wrapper.find('#loading').text()).toBe('true')
    expect(wrapper.find('#user').text()).toBe('{}')
  })
})
