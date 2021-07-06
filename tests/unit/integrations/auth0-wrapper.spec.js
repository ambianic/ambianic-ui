import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin } from '@/auth'
import { cloneDeep } from 'lodash'
import pnp from '@/store/pnp.js'
import premiumService from '@/store/premium-service.js'
import flushPromises from 'flush-promises'

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
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('`loadingAuth` is set to false after `handleRedirectCallback` fetches user data', async () => {
    jest.resetAllMocks()

    wrapper.vm.$auth.auth0Client = {
      getUser: null
    }

    expect(store.state.premiumService.loadingAuth).toBeTruthy()
    await wrapper.vm.$auth.handleRedirectCallback()

    await flushPromises()

    setTimeout(() => expect(store.state.premiumService.loadingAuth).toBe(false), 1000)
  })

  test('It loads Auth0 Client plugin and instance methods', async (done) => {
    wrapper.vm.$auth.auth0Client = {
      authenticateUser: jest.fn().mockReturnValue({ }),
      handleRedirectCallback: jest.fn().mockReturnValue({ appState: { state: {} } }),
      getUser: jest.fn().mockReturnValue({ name: 'John Doe' }),
      loginWithRedirect: jest.fn(),
      logout: jest.fn().mockReturnValue(true),
      isAuthenticated: jest.fn().mockReturnValue(true)
    }

    expect(typeof wrapper.vm.$auth.handleRedirectCallback).toBe('function')
    await wrapper.vm.$auth.handleRedirectCallback()
    expect(wrapper.vm.$auth.auth0Client.handleRedirectCallback).toHaveBeenCalled()

    expect(typeof wrapper.vm.$auth.logout).toBe('function')
    await wrapper.vm.$auth.logout()

    await wrapper.vm.$auth.authenticateUser()
    expect(typeof wrapper.vm.$auth.authenticateUser).toBe('function')

    expect(typeof wrapper.vm.$auth.loginWithRedirect).toBe('function')
    await wrapper.vm.$auth.loginWithRedirect()
    expect(wrapper.vm.$auth.auth0Client.loginWithRedirect).toHaveBeenCalled()
    done()
  })
})
