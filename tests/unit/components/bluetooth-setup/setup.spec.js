import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Setup from '@/views/SetupEdge.vue'

describe('Setup', () => {
  // global
  let wrapper
  const localVue = createLocalVue()
  document.body.setAttribute('data-app', true)
  Vue.use(Vuetify) // for shallowshallowMount use
  localVue.use(VueX)

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

    getters = {
      //   ...
    }

    store = new VueX.Store({
      state,
      getters
    })

    // using shallowMount with subtree components
    wrapper = mount(Setup, {
      localVue,
      vuetify,
      router,
      store,
      data() {
        return {
          edgeConnected: false,
          dialog: false,
          selectedWifi: String
        }
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Should alter wifi variable using data', () => {
    wrapper.setData({selectedWifi: "Test"})
    expect(wrapper.vm.selectedWifi).toBe("Test")
  })

  test('Should alter edgeConnected using data', () => {
    wrapper.setData({edgeConnected: true})
    expect(wrapper.vm.edgeConnected).toBe(true)
  })

  test('Should alter dialog using data and check if dialog is open', async () => {
    wrapper.setData({dialog: true})
    expect(wrapper.vm.dialog).toBe(true)

    wrapper.findAll('.v-btn#searchWifis').trigger('click')
    await wrapper.vm.$nextTick()
    const drawer = wrapper.find('.v-dialog')
    expect(drawer.text()).toContain('WIFIS')
  })
})
