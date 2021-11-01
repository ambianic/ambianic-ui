import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import DeviceCard from '@/views/DeviceCard.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED, NEW_REMOTE_PEER_ID } from '@/store/mutation-types'
import { cloneDeep } from 'lodash'
import { myDevicesStoreModule } from '@/store/mydevices'
import { pnpStoreModule } from '../../../src/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { EdgeDeviceCard } from '../../../src/store/localdb'
import flushPromises from 'flush-promises'
import sleep from 'sleep-promise'
import { PEER_DISCONNECTED } from '../../../src/store/mutation-types'

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

  test('should show current device info in read only mode when disconnected', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn()
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()
    expect(state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = '1.2.3.test'
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    console.debug('state.myDevices.allDeviceCards: ', state.myDevices.allDeviceCards)
    console.debug('state.myDevices.currentDeviceCard: ', state.myDevices.currentDeviceCard)
    expect(wrapper.findComponent({ ref: 'edge-device-disconnected' }).exists()).toBeTrue()
    await Vue.nextTick()
    await flushPromises()
    const deviceName = newDeviceCard.displayName
    console.debug('state.pnp.peerConnectionStatus:', state.pnp.peerConnectionStatus)
    console.debug('state.pnp.remotePeerId:', state.pnp.remotePeerId)
    console.debug('wrapper.vm.edgeDisplayName', wrapper.vm.edgeDisplayName)
    let listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    console.debug('displayName wrapper HTML:\n', listItem.html())
    console.debug('list-item-edgeDeviceName:', { listItem })
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
      editOption: false,
      error: undefined,
      onSubmit: expect.any(Function),
      rules: [expect.anything(), expect.anything()]
    })
  })


  test('should edit and save custom edge display name when connected', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn()
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockImplementation( async () => {
      return {
        status: 'OK',
        version: '1.2.3.test',
        display_name: 'Remote Device'
      }
    })
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    newDeviceCard.displayName = 'New Device'
    newDeviceCard.version = '1.2.3.test'
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    await Vue.nextTick()
    await flushPromises()
    // flushPromises() is not enough to resolve all vuex interactions
    // which is why we are adding wait time
    await new Promise(function(resolve) {setTimeout(resolve,100)})
    const deviceName = 'Remote Device'
    // console.debug('wrapper HTML:\n', wrapper.html())
    expect(wrapper.findComponent({ ref: 'edge-device-connected' }).exists()).toBeTrue()
    console.debug('state.pnp.peerConnectionStatus:', state.pnp.peerConnectionStatus)
    console.debug('state.pnp.remotePeerId:', state.pnp.remotePeerId)
    let listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    console.debug('list-item-edgeDeviceName:', { listItem })
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
    console.debug('state.pnp.peerConnectionStatus:', state.pnp.peerConnectionStatus)
    console.debug('state.pnp.remotePeerId:', state.pnp.remotePeerId)
    // Check how displayName is rendered after connection is established.
    // It should be editable now.
    let nameLabel = listItem.findComponent({ ref: 'title-read-only' })
    expect(nameLabel.exists()).toBeTrue()
    let editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    await flushPromises()
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeFalsy()
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' }).find('input[type="text"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('Kitchen Monitor')
    console.debug('amb-list-item HTML', listItem.html())
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    await Vue.nextTick()
    // flushPromises() is not enough to resolve all vuex interactions
    // which is why we are adding wait time
    await new Promise(function(resolve) {setTimeout(resolve,100)})
    expect(store.state.pnp.edgeAPI.setDeviceDisplayName).toHaveBeenCalledTimes(1)
    expect(store.state.pnp.edgeAPI.setDeviceDisplayName).toHaveBeenCalledWith('Kitchen Monitor')
    listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    console.debug('amb-list-item HTML', listItem.html())
    nameLabel = listItem.findComponent({ ref: 'title-read-only' })
    expect(nameLabel.exists()).toBeTrue()
    console.debug('nameLabel HTML', nameLabel.html())
    expect(nameLabel.html()).toContain('Kitchen Monitor')
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
  })

  test('should handle save errors for custom edge display name', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    const errorMessage = 'Remote API error while saving new device name'
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockResolvedValue({
      status: 'OK',
      version: 'Oct.4.2021.testing',
      display_name: 'Remote Device Name'
    })
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage)
    })
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    const deviceName = 'Remote Device Name'
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    // flushPromises() does not take care of the full chain of pending async vuex events
    // which trigger other events. Remote API, watchers, computed, etc.
    // That is why we need to add some sleep or else implement a complex vuex internal state tracking machine.
    await sleep(100)
    // console.debug('wrapper HTML', wrapper.html())
    const listItem = wrapper.findComponent({ ref: 'list-item-edgeDeviceName' })
    expect(listItem.exists()).toBe(true)
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
    await flushPromises()
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' }).find('input[type="text"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('Stairs Monitor')
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    await flushPromises()
    const api = store.state.pnp.edgeAPI.setDeviceDisplayName
    expect(api).toHaveBeenCalledTimes(1)
    expect(api).toHaveBeenCalledWith('Stairs Monitor')
    expect(api).toThrow(Error(errorMessage))
    const nameLabel = listItem.findComponent({ ref: 'title-read-only' })
    expect(nameLabel.exists()).toBeTrue()
    expect(nameLabel.html()).toContain(deviceName)
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    const errorBox = wrapper.findComponent({ ref: 'edge-device-error' })
    expect(errorBox.html()).toContain('Error updating display name.')
  })


  test('`fetchEdgeDetails` method handles missing edge version response', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockResolvedValue({
      // mock return of status but no version attribute in json response.
      // emulate older edge device whose status API does not include version info
      status: 'OK'
    })
    wrapper = await mount(DeviceCard, options)
    await Vue.nextTick()

    await wrapper.vm.fetchEdgeDetails()

    expect(wrapper.vm.edgeDeviceError).toBe('Edge device requires update.')
  })
})
