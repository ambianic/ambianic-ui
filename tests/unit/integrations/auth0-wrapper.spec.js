import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin } from '@/auth'
import { cloneDeep } from 'lodash'
import pnp from '@/store/pnp.js'
import premiumService from '@/store/premium-service.js'

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
  Vue.use(Vuetify)
  localVue.use(VueX)

  const CLIENT_DOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
  const CLIENT_SECRET = process.env.VUE_APP_AUTH0_CLIENTID

  // AUTH0 PLUGIN
  Vue.use(Auth0Plugin, {
    CLIENT_DOMAIN,
    CLIENT_SECRET,
    onRedirectCallback: (appState) => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      )
    }
  })

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        pnp: cloneDeep(pnp),
        premiumService: cloneDeep(premiumService)
      }
    })

    // using shallowMount with subtree components
    wrapper = mount(Component, {
      localVue,
      vuetify,
      router,
      store
    })

    // without making a copy you will have a circular dependency problem during mocking
    const originalWindow = { ...window }
    const windowSpy = jest.spyOn(global, 'window', 'get')
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      history: {
        ...originalWindow.history,
        replaceState: jest.fn()
      }
    }))
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('It contains auth0 methods', async () => {
    expect(wrapper.find('#login').exists()).toBe(true)
    expect(wrapper.find('#client').exists()).toBe(true)
    expect(wrapper.find('#logout').exists()).toBe(true)
  })

  test('It loads Auth0 Client plugin', async (done) => {
    console.debug('TEST REDIRECT')
    console.debug(window.history)

    wrapper.vm.$auth.auth0Client = {
      handleRedirectCallback: jest.fn().mockReturnValue({ appState: { state: {} } }),
      getUser: jest.fn().mockReturnValue({ name: 'John Doe' }),
      loginWithRedirect: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(true)
    }

    wrapper.vm.$auth.handleRedirectCallback()
    wrapper.vm.$auth.loginWithRedirect()
    wrapper.vm.$auth.logout()
    wrapper.vm.$auth.authenticateUser()

    done()
  })

  test('handleRedirectCallback clears user data after logout', (done) => {
    wrapper.vm.$auth.auth0Client = {
      handleRedirectCallback: null
    }

    wrapper.vm.$auth.handleRedirectCallback()

    done()
  })
})
