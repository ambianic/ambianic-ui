import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { Auth0Plugin } from '@/auth'

const Component = {
  template: `
    <div>

    <button id="login" @click="$auth.handleTestLogin()"> Login </button>
    <p id="user-details" > {{ $auth.user }} </p>

      <div  id="authenticated" v-if="$auth.isAuthenticated" >
          <span id="user">{{ $auth.user }}</span>
      </div>
     
      <button  id="logout" @click="" > Logout </button>
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

  test('It loads application in unauthenticated state on first use', async () => {
    expect(wrapper.find('#user-details').text()).toBe('{}')

    expect(wrapper.find('#isAuthenticated').exists()).toBe(false)
  })

  // find a way to convert to BOOL values
  test('It should have initial authentication & user state', async () => {
    await wrapper.find('#login').trigger('click')
    expect(wrapper.find('#authenticated').exists()).toBe(true)

    expect(typeof wrapper.find('#user').text()).toBe('string')
  })
})
