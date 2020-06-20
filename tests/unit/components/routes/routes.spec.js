import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import Home from '@/views/Home.vue'
import routes from '@/router/index.js'

describe('Routing', () => {
// global
let wrapper
const localVue = createLocalVue()
Vue.use(Vuetify) // for shallowshallowMount use
localVue.use(VueX)

let store, state, getters

// global
localVue.use(VueRouter)

const vuetify = new Vuetify()
const router = new VueRouter({routes})

beforeEach(() => {
  state = {
    pnp: {
      peerConnectionStatus: jest.fn()
    }
  }

  getters = {
  //   ...
  }

  store = new VueX.Store({
    state,
    getters
  })

  // using shallowMount with subtree components
  wrapper = mount(Home, {
    localVue,
    vuetify,
    router,
    store
  })
})

  afterEach(() => {
    wrapper.destroy()
  })

  test('Should navigate to Settings from Home', async () => {
    console.log(wrapper.$route) // need this result    
    router.push("/settings")
    await wrapper.vm.$nextTick()

    console.log(wrapper)
    console.log(wrapper.findComponent(Settings))

    expect(wrapper.findComponent(Settings).exists()).toBe(true)

  })
})
