import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import SnackNotification from '@/components/shared/snackNotification'
import Vuex from 'vuex'
import { pnpStoreModule } from '@/store/pnp'
import { PEER_CONNECTED, PEER_CONNECTING, PEER_DISCONNECTED } from '@/store/mutation-types'

describe('SnackNotification Component', () => {
  let wrapper, store
  const localVue = createLocalVue()

  Vue.use(Vuetify)
  Vue.use(Vuex)

  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        pnp: pnpStoreModule
      }
    })

    wrapper = mount(SnackNotification, {
      localVue,
      vuetify,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('It should contain a `p` element and close icon', () => {
    expect(wrapper.find('#snack-message').exists()).toBeTruthy()
    expect(wrapper.find('#close-icon').exists()).toBeTruthy()
  })

  it('Displayed text changes with `peerConnectionStatus` state', () => {
    const connectingText = 'Connecting to Ambianic Edge device'
    const connectedText = 'Connected to Ambianic Edge device'
    const disconnectedText = 'Disconnected from Ambianic Edge device'

    store.state.pnp.peerConnectionStatus = PEER_CONNECTING
    const connectingComp = mount(SnackNotification, {
      localVue,
      vuetify,
      store
    })
    expect(connectingComp.find('#snack-message').text()).toBe(connectingText)

    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    const connectedComp = mount(SnackNotification, {
      localVue,
      vuetify,
      store
    })
    expect(connectedComp.find('#snack-message').text()).toBe(connectedText)

    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    const disconnectedComp = mount(SnackNotification, {
      localVue,
      vuetify,
      store
    })
    expect(disconnectedComp.find('#snack-message').text()).toBe(disconnectedText)
  })

  it('`peerConnectionStatus` status controls SnackNotification visibility', () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    const newComponent = mount(SnackNotification, {
      localVue,
      vuetify,
      store
    })

    expect(newComponent.find('#snack-message').exists()).toBeTruthy()
  })
})
