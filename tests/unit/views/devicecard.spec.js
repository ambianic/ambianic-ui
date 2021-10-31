import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import DeviceCard from '@/views/DeviceCard.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED, NEW_PEER_ID } from '@/store/mutation-types'
import { cloneDeep } from 'lodash'
import { myDevicesStoreModule } from '@/store/mydevices'
import { pnpStoreModule } from '../../../src/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { EdgeDeviceCard } from '../../../src/store/localdb'

describe('More Settings View tests', () => {
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
    await wrapper.destroy()
  })

  test.only('should edit and save custom edge display name', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn()
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()
    store.commit(PEER_CONNECTED)
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    store.commit(NEW_PEER_ID, remotePeerId)
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = '1.2.3.test'
    await store.dispatch('myDevices/add', newDeviceCard)
    await store.dispatch('myDevices/setCurrent', '0da0d142-9859-4371-96b7-decb180fcd37')
    const deviceName = null
    const listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    console.debug('amb-list-item component:', { listItem })
    expect(listItem.exists()).toBe(true)
    console.debug('listItem.props()', listItem.props())
    expect(listItem.props()).toEqual({
      sensitiveField: false,
      align: null,
      justify: null,
      title: deviceName,
      subtitle: 'Friendly Name',
      iconName: 'tag',
      twoLine: false,
      copyOption: false,
      editOption: true,
      error: undefined,
      onSubmit: expect.any(Function),
      rules: [expect.anything(), expect.anything()]
    })
    let editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeFalsy()
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' }).find('input[type="text"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('Kitchen Monitor')
    console.debug('amb-list-item HTML', listItem.html())
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    expect(store.state.pnp.edgeAPI.setDeviceDisplayName).toHaveBeenCalledTimes(1)
    expect(store.state.pnp.edgeAPI.setDeviceDisplayName).toHaveBeenCalledWith('Kitchen Monitor')
    await Vue.nextTick()
    console.debug('amb-list-item HTML', listItem.html())
    const nameLabel = listItem.findComponent({ ref: 'title-read-only' })
    expect(nameLabel.exists()).toBeTrue()
    console.debug('nameLabel HTML', nameLabel.html())
    expect(nameLabel.html()).toContain('Kitchen Monitor')
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
  })

  test('should handle save errors for custom edge display name', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const deviceName = 'My Ambianic Edge Device'
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    const errorMessage = 'Remote API error while saving new device name'
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockResolvedValue({
      status: 'OK',
      version: 'Oct.4.2021.testing',
      display_name: 'New Device Name'
    })
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage)
    })
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()
    console.debug('wrapper HTML', wrapper.html())
    const listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    expect(listItem.exists()).toBe(true)
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
    let editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' }).find('input[type="text"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('Stairs Monitor')
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    const api = store.state.pnp.edgeAPI.setDeviceDisplayName
    expect(api).toHaveBeenCalledTimes(1)
    expect(api).toHaveBeenCalledWith('Stairs Monitor')
    expect(api).toThrow(Error(errorMessage))
    const nameLabel = listItem.findComponent({ ref: 'title-read-only' })
    expect(nameLabel.exists()).toBeTrue()
    expect(nameLabel.html()).toContain('New Device Name')
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    const errorBox = wrapper.findComponent({ ref: 'edge-device-error' })
    expect(errorBox.html()).toContain('Error updating display name.')
  })
})
