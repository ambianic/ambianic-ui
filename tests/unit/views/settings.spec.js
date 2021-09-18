import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED } from '@/store/mutation-types'
import AmbListItem from '@/components/shared/ListItem.vue'
import { cloneDeep } from 'lodash'
import edgeDevice from '@/store/edge-device.js'
import { pnpStoreModule } from '../../../src/store/pnp'
import snackBarModule from '@/store/status-snackbar'

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
          edgeDevice: cloneDeep(edgeDevice),
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
    const card = wrapper.find('.v-card')
    expect(card.find('.v-card__title').text()).toBe('Ambianic Edge connection details')
    expect(card.exists()).toBe(true)
  })

  test('should have Discover Local button', async () => {
    wrapper = await mount(Settings, options)
    const btn = wrapper.find('#btn-discoverLocal')
    expect(btn.exists()).toBe(true)
  })

  test('should have Pair Remotely button', async () => {
    wrapper = await mount(Settings, options)
    const btn = wrapper.find('#btn-sendRemotePeerID')
    expect(btn.exists()).toBe(true)
  })

  test('should have correct edge peerID display information', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    expect(wrapper.vm.edgePeerId).toBe(store.state.pnp.remotePeerId)
    const listItems = wrapper.findAllComponents(AmbListItem)
    console.debug('Settings.vue amb-list-item components:', { listItems })
    expect(listItems.length).toBe(3)
    // for (const item of listItems.wrappers) {
    //  console.debug('amb-list-item component:', { item })
    // }
    // console.debug('Settings.vue HTML:[', wrapper.html(), ']')
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
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    wrapper = await mount(Settings, options)
    await Vue.nextTick()
    const deviceName = 'My Ambianic Edge Device'
    const listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    console.debug('amb-list-item component:', { listItem })
    expect(listItem.exists()).toBe(true)
    console.debug('listItem.props()', listItem.props())
    expect(listItem.props()).toEqual({
      sensitiveField: false,
      align: null,
      justify: null,
      title: deviceName,
      subtitle: 'Display Name',
      iconName: 'tag',
      twoLine: false,
      copyOption: false,
      editOption: true,
      error: undefined,
      onSubmit: expect.any(Function),
      rules: [expect.anything(), expect.anything()]
    })
  })

  test('Connected Edge device version is shown', async () => {
    const localEdgeVersion = '2.50.5'

    const newStore = new VueX.Store({
      modules: {
        pnp: cloneDeep(pnpStoreModule),
        edgeDevice: cloneDeep(edgeDevice),
        snackBar: cloneDeep(snackBarModule)
      }
    })

    newStore.state.edgeDevice.edgeSoftwareVersion = localEdgeVersion
    newStore.state.pnp.peerConnectionStatus = PEER_CONNECTED
    newStore.state.pnp.remotePeerId = '1234-1234-1234-1234-1234'

    wrapper = await mount(Settings, {
      localVue,
      vuetify,
      router,
      store: newStore
    })
    await Vue.nextTick()
    const versionElement = wrapper.findComponent({ ref: "list-item-edgeVersion" })
    expect(versionElement.exists()).toBeTrue()
    const versionLabel = versionElement.findComponent({ ref: 'title-read-only' })
    expect(versionLabel.exists()).toBeTrue()
    expect(versionLabel.html()).toContain(localEdgeVersion)
    expect(versionLabel.text()).toBe(localEdgeVersion)
  })

  test('`fetchEdgeDetails` method handles missing edge version response', async () => {
    wrapper.vm.edgeAPI.getEdgeStatus = jest.fn().mockResolvedValue({
      status: 'OK'
    })

    await wrapper.vm.fetchEdgeDetails()

    expect(wrapper.vm.edgeDeviceError).toBe('Edge device offline or requires update.')
  })
})
