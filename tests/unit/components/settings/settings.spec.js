import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_CONNECTED } from '../../../../src/store/mutation-types'
import { cloneDeep } from 'lodash'
import { applicationStore } from '../../../../src/store'

describe('NavBar', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  localVue.use(VueX)

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      state: cloneDeep(applicationStore.state),
      modules: cloneDeep(applicationStore.modules),
      actions: cloneDeep(applicationStore.actions),
      mutations: cloneDeep(applicationStore.mutations)
    })

    // using shallowMount with subtree components
    wrapper = mount(Settings, {
      localVue,
      vuetify,
      router,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
  test('Connection details loaded', () => {
    const card = wrapper.find('.v-card')
    expect(card.find('.v-card__title').text()).toBe('Ambianic Edge connection details')
    expect(card.exists()).toBe(true)
  })

  test('should load 2 buttons', () => {
    const btn = wrapper.findAll('.v-btn')
    expect(btn.length).toBe(2)
  })

  test('Connected Edge device version is shown', () => {
    store.state.version = '1.2'
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '1234-1234-1234-1234-1234'

    const component = mount(Settings, {
      localVue,
      vuetify,
      store
    })

    const versionElement = component.get('#version-element')
    expect(versionElement.find('#title').text()).toBe('1.2')
  })
})
