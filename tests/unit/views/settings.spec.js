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

describe('NavBar', () => {
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
      peerConnectionStatus: jest.fn(),
      edgePeerId: jest.fn()
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
        modules:
        {
          pnp:
          cloneDeep({
            state,
            getters,
            mutations,
            actions
          })
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
    expect(listItem.props()).toStrictEqual({
      sensitiveField: true,
      align: null,
      justify: null,
      title: store.state.pnp.remotePeerId,
      subtitle: 'Peer ID',
      iconName: 'identifier',
      twoLine: false,
      copyOption: true
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
    expect(listItem.props()).toStrictEqual({
      sensitiveField: false,
      align: null,
      justify: null,
      title: deviceName,
      subtitle: 'Display Name',
      iconName: 'tag',
      twoLine: false,
      copyOption: false
    })
  })
})
