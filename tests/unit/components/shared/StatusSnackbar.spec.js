import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import StatusSnackbar from '@/components/shared/StatusSnackbar'
import Vuex from 'vuex'
import { pnpStoreModule } from '@/store/pnp'
import { PEER_CONNECTED, PEER_CONNECTING, PEER_DISCONNECTED } from '@/store/mutation-types'
import { PEER_CONNECTED_NOTIFICATION, PEER_DISCONNECTED_NOTIFICATION, PEER_CONNECTING_NOTIFICATION } from '@/components/utils'
import snackBarModule from '@/store/status-snackbar'

describe('Snack Notification Component', () => {
  let wrapper, store
  const localVue = createLocalVue()

  Vue.use(Vuetify)
  Vue.use(Vuex)

  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        pnp: pnpStoreModule,
        snackBar: snackBarModule
      }
    })

    wrapper = mount(StatusSnackbar, {
      localVue,
      vuetify,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('It should contain a `p` element and close icon', async () => {
    await Vue.nextTick()
    expect(wrapper.find('#snack-message').exists()).toBeTruthy()
    expect(wrapper.findComponent({ ref: 'close-btn' }).exists()).toBeTrue()
    expect(wrapper.findComponent({ ref: 'close-btn' }).text()).toEqual('Close')
  })

  it('Displayed text changes with `peerConnectionStatus` state', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTING
    const connectingComp = mount(StatusSnackbar, {
      localVue,
      vuetify,
      store
    })
    await Vue.nextTick()
    expect(connectingComp.find('#snack-message').text()).toBe(PEER_CONNECTING_NOTIFICATION)
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    const connectedComp = mount(StatusSnackbar, {
      localVue,
      vuetify,
      store
    })
    expect(connectedComp.find('#snack-message').text()).toBe(PEER_CONNECTED_NOTIFICATION)

    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED
    const disconnectedComp = mount(StatusSnackbar, {
      localVue,
      vuetify,
      store
    })
    expect(disconnectedComp.find('#snack-message').text()).toBe(PEER_DISCONNECTED_NOTIFICATION)
    expect(wrapper.findComponent({ ref: 'close-btn' }).exists()).toBeTrue()
    expect(wrapper.findComponent({ ref: 'close-btn' }).text()).toEqual('Close')
  })

  it('`peerConnectionStatus` status controls StatusSnackbar visibility', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    expect(wrapper.findComponent({ ref: 'close-btn' }).exists()).toBeTrue()
    expect(wrapper.findComponent({ ref: 'close-btn' }).text()).toEqual('Close')
  })
})
