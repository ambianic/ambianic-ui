import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED, PEER_DISCONNECTED, NEW_REMOTE_PEER_ID }
  from '@/store/mutation-types'
import AmbListItem from '@/components/shared/ListItem.vue'
import { cloneDeep } from 'lodash'
import { pnpStoreModule } from '@/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { myDevicesStoreModule } from '@/store/mydevices'
import flushPromises from 'flush-promises'
import { EdgeDeviceCard } from '@/store/localdb'
import sleep from 'sleep-promise'

describe('Settings View', () => {
  // global
  let wrapper

  Vue.use(Vuetify)

  const localVue = createLocalVue()
  localVue.use(VueX)

  let store, state, getters, actions, options

  const mutations = {
    testMutation: jest.fn()
  }

  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(async () => {
    state = {
    }

    getters = {
    //   ...
    }

    actions = {
      [PEER_DISCOVER] (context) {
      }
    }

    store = new VueX.Store(
      {
        state,
        getters,
        mutations,
        actions,
        modules:
        {
          pnp: cloneDeep(pnpStoreModule),
          myDevices: cloneDeep(myDevicesStoreModule),
          snackBar: cloneDeep(snackBarModule)
        }
      }
    )

    options = {
      localVue,
      vuetify,
      router,
      store
    }
  })

  afterEach(async () => {
    // console.info('afterEach - Settings.vue HTML:[', wrapper.html(), ']')
    await wrapper.destroy()
  })

  test('Connection details loaded', async () => {
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    const cardTitle = wrapper.findComponent({ ref: 'device-card-title' })
    expect(cardTitle.exists()).toBe(true)
    expect(cardTitle.text()).toBe('Select a device')
  })

  test('should have My Devices button', async () => {
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    const btn = wrapper.findComponent({ ref: 'mydevices-btn' })
    expect(btn.exists()).toBe(true)
  })

  test('should have correct edge peerID display information', async () => {
    const localEdgeVersion = '2.50.5'
    expect(state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = localEdgeVersion
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    await Vue.nextTick()
    expect(wrapper.vm.edgePeerId).toBe(store.state.pnp.remotePeerId)
    const listItems = wrapper.findAllComponents(AmbListItem)
    console.debug('Settings.vue amb-list-item components:', { listItems })
    expect(listItems.length).toBe(1)
    const listItem = wrapper.findComponent({ ref: 'list-item-edgePeerID' })
    console.debug('amb-list-item component:', { listItem })
    expect(listItem.exists()).toBe(true)
    console.debug('listItem.props()', listItem.props())
    expect(listItem.props()).toEqual({
      sensitiveField: true,
      align: null,
      justify: null,
      title: store.state.pnp.remotePeerId,
      subtitle: 'Peer ID',
      iconName: 'identifier',
      twoLine: false,
      copyOption: true,
      editOption: false,
      error: undefined,
      rules: [],
      onSubmit: expect.any(Function)
    })
  })

  test('should have correct edge display name', async () => {
    const localEdgeVersion = '2.50.5'
    expect(state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = localEdgeVersion
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    await Vue.nextTick()
    flushPromises()
    const deviceName = newDeviceCard.displayName
    const listItem = wrapper.findComponent({ ref: 'device-card-title' })
    console.debug('device-card-title component:', { listItem })
    expect(listItem.exists()).toBe(true)
    expect(listItem.text()).toBe(deviceName)
  })

  test('Connected Edge device ID and Display Name are shown', async () => {
    const localEdgeVersion = '2.50.5'
    expect(state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = localEdgeVersion
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    await Vue.nextTick()
    await flushPromises()
    await sleep(100)
    console.debug('state.myDevices.allDeviceCards: ', state.myDevices.allDeviceCards)
    console.debug('state.myDevices.currentDeviceCard: ', state.myDevices.currentDeviceCard)
    console.debug('wrapper.vm.edgePeerId:', wrapper.vm.edgePeerId)
    const versionElement = wrapper.findComponent({ ref: 'list-item-edgeVersion' })
    expect(versionElement.exists()).toBeFalse()
    let idElement = wrapper.findComponent({ ref: 'list-item-edgePeerID' })
    expect(idElement.exists()).toBeTrue()
    let idLabel = idElement.findComponent({ ref: 'input-title-sensitive' })
    expect(idLabel.exists()).toBeTrue()
    console.debug('idLabel.html(): ', idLabel.html())
    let revealIcon = idElement.findComponent({ ref: 'icon-sensitive-on' })
    expect(revealIcon.exists()).toBeTrue()
    await revealIcon.trigger('click')
    await Vue.nextTick()
    await flushPromises()
    idElement = wrapper.findComponent({ ref: 'list-item-edgePeerID' })
    expect(idElement.exists()).toBeTrue()
    expect(idElement.props('title')).toBe(remotePeerId)
    idLabel = idElement.findComponent({ ref: 'input-title-sensitive' })
    expect(idLabel.exists()).toBeTrue()
    console.debug('idLabel.html(): ', idLabel.html())
    expect(idLabel.props('disabled')).toBe(true)
    expect(idLabel.props('type')).toBe('text')
  })

})
