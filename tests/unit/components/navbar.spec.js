import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { pnpStoreModule } from '@/store/pnp'
import { myDevicesStoreModule } from '@/store/mydevices'
import { PEER_CONNECTING, PEER_DISCONNECTED, PEER_CONNECTED } from '@/store/mutation-types'

describe('NavBar', () => {
// global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowshallowMount use
  localVue.use(VueX)

  let store

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        pnp: pnpStoreModule,
        myDevices: myDevicesStoreModule
      }
    })

    // using shallowMount with subtree components
    wrapper = mount(NavBar, {
      localVue,
      vuetify,
      router,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('should load app bar', () => {
    const bar = wrapper.findComponent({ ref: 'app-bar' })
    expect(bar.exists()).toBe(true)
  })

  test('should show navbar buttons:: menu, timeline, connection status and settings', () => {
    expect(wrapper.findComponent({ ref: 'menu-btn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'timeline-btn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'connection-status-btn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'settings-btn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'blah-blah-btn' }).exists()).toBe(false)
  })

  test('should load navigation drawer', () => {
    const nav = wrapper.find('.v-navigation-drawer')
    const item = wrapper.findAll('.v-list-item')

    expect(nav.exists()).toBe(true)
    expect(item.length).toBe(5)
  })

  test('`peerConnectionStatus` ConnectionStatusIcon shows off when disonnected', async () => {
    wrapper.vm.$store.commit(PEER_DISCONNECTED)
    await wrapper.vm.$nextTick()
    const btn = wrapper.findComponent({ ref: 'connection-status-btn' })
    const cloudIconClasses = btn.find('i').classes()
    expect(cloudIconClasses.includes('mdi-cloud-off-outline')).toBeTruthy()
  })

  test('`peerConnectionStatus` ConnectionStatusIcon shows sync when connecting', async () => {
    wrapper.vm.$store.commit(PEER_CONNECTING)
    await wrapper.vm.$nextTick()
    const btn = wrapper.findComponent({ ref: 'connection-status-btn' })
    const cloudIconClasses = btn.find('i').classes()
    expect(cloudIconClasses.includes('mdi-cloud-off-outline')).toBeFalsy()
    expect(cloudIconClasses.includes('mdi-cloud-sync-outline')).toBeTruthy()
  })

  test('`peerConnectionStatus` ConnectionStatusIcon shows checkmark when connected', async () => {
    wrapper.vm.$store.commit(PEER_CONNECTED)
    await wrapper.vm.$nextTick()
    const btn = wrapper.findComponent({ ref: 'connection-status-btn' })
    const cloudIconClasses = btn.find('i').classes()
    expect(cloudIconClasses.includes('mdi-cloud-sync-outline')).toBeFalsy()
    expect(cloudIconClasses.includes('mdi-cloud-off-outline')).toBeFalsy()
    expect(cloudIconClasses.includes('mdi-cloud-check-outline')).toBeTruthy()
  })
})
