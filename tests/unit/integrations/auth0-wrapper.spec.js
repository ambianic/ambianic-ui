import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin, useAuth0 } from '@/auth'
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

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeAll(
    () => {
      global.window.location.pathname = '/timeline'
      global.document.title = 'Ambianic UI'

      global.window.history = {
        replaceState: jest.fn()
      }
    }
  )

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

  test('Auth0 plugin', async () => {
    const component = mount(useAuth0({
      onRedirectCallback: CLIENTDOMAIN,
      redirectUri: CLIENTSECRET
    }), {
      localVue,
      vuetify,
      router,
      store,
      data: {
        auth0Client: {
          handleRedirectCallback: jest.fn(),
          getUser: jest.fn()
        }
      }
    })

    console.debug(window.history, 'AUTH0 VM')

    // component.vm.handleRedirectCallback()
    // console.debug(wrapper.vm.handleRedirectCallback);
  })
})
