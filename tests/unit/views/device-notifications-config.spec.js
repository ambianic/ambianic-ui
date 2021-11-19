import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import DeviceNotificationsConfig from '@/views/DeviceNotificationsConfig'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED, NEW_REMOTE_PEER_ID, PEER_DISCONNECTED } from '@/store/mutation-types'
import { cloneDeep } from 'lodash'
import { myDevicesStoreModule } from '@/store/mydevices'
import { pnpStoreModule } from '@/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { EdgeDeviceCard } from '@/store/localdb'
import flushPromises from 'flush-promises'
import sleep from 'sleep-promise'

describe('Device Notifications Config View tests', () => {
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

  // create a parent dom for top level componnets that need one
  const div = document.createElement('div')
  document.body.appendChild(div)

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
      store,
      attachTo: div
    }
  })

  afterEach(async () => {
    await wrapper.destroy()
  })

  test('should show No Device Connection when Disconnected', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    wrapper = await mount(DeviceNotificationsConfig, options)
    await Vue.nextTick()
    expect(state.pnp.peerConnectionStatus).toBe(PEER_DISCONNECTED)
    const noConnectionCard = wrapper.findComponent({ ref: 'no-connection-card' })
    expect(noConnectionCard.exists()).toBeTrue()
    const title = wrapper.findComponent({ ref: 'card-title' })
    expect(title.exists()).toBeTrue()
    expect(title.text()).toContain('No device connection')
  })

  test('should edit and save custom IFTTT key when connected', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.setIftttKey = jest.fn()
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockImplementation(async () => {
      return {
        status: 'OK',
        version: '1.2.3.test',
        display_name: 'Remote Device'
      }
    })
    wrapper = await mount(DeviceNotificationsConfig, options)
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
    expect(wrapper.findComponent({ ref: 'notifications-enabled-switch' }).isVisible()).toBeTrue()
    expect(wrapper.findComponent({ ref: 'list-item-notificationsProvider' }).isVisible()).toBeTrue()
    let apiKey = wrapper.findComponent({ ref: 'list-item-apiKey' })
    expect(apiKey.isVisible()).toBeTrue()
    let editIcon = apiKey.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    await flushPromises()
    editIcon = apiKey.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeFalsy()
    const nameInput = apiKey.findComponent({ ref: 'inputTitleEdit' }).find('input[type="password"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('96KE0qGYSC4emUtIpRpNJ')
    const saveIcon = apiKey.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    await Vue.nextTick()
    await flushPromises()
    expect(store.state.pnp.edgeAPI.setIftttKey).toHaveBeenCalledTimes(1)
    expect(store.state.pnp.edgeAPI.setIftttKey).toHaveBeenCalledWith('96KE0qGYSC4emUtIpRpNJ')
    apiKey = wrapper.findComponent({ ref: 'list-item-apiKey' })
    editIcon = apiKey.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
  })

  test('should handle save errors for custom edge display name', async () => {
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    const errorMessage = 'Testing Remote API error while saving IFTTT key'
    store.state.pnp.edgeAPI.getEdgeStatus = jest.fn().mockResolvedValue({
      status: 'OK',
      version: 'Oct.4.2021.testing',
      display_name: 'Remote Device Name'
    })
    store.state.pnp.edgeAPI.setIftttKey = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage)
    })
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    wrapper = await mount(DeviceNotificationsConfig, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    // flushPromises() does not take care of the full chain of pending async vuex events
    // which trigger other events. Remote API, watchers, computed, etc.
    // That is why we need to add some sleep or else implement a complex vuex internal state tracking machine.
    await sleep(100)
    const listItem = wrapper.findComponent({ ref: 'list-item-apiKey' })
    expect(listItem.exists()).toBe(true)
    expect(listItem.props()).toEqual({
      sensitiveField: true,
      align: null,
      justify: null,
      title: '__ENTER_NEW_KEY__',
      subtitle: 'IFTTT Webhooks API Key',
      iconName: 'key',
      twoLine: false,
      copyOption: false,
      editOption: true,
      error: undefined,
      onSubmit: expect.any(Function),
      rules: [expect.anything(), expect.anything()]
    })
    const editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    await flushPromises()
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' }).find('input[type="password"]')
    expect(nameInput.exists()).toBeTrue()
    nameInput.setValue('96KE0qGYSC4emUtIpSpKK')
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    await saveIcon.trigger('click')
    await flushPromises()
    const api = store.state.pnp.edgeAPI.setIftttKey
    expect(api).toHaveBeenCalledTimes(1)
    expect(api).toHaveBeenCalledWith('96KE0qGYSC4emUtIpSpKK')
    expect(api).toThrow(Error(errorMessage))
    const error = wrapper.findComponent({ ref: 'edge-device-error' })
    expect(error.isVisible()).toBeTrue()
  })

  test('Test button triggers API request only when notifications are enabled', async () => {
    const remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    const newDeviceCard = new EdgeDeviceCard()
    newDeviceCard.peerID = remotePeerId
    wrapper = await mount(DeviceNotificationsConfig, options)
    await Vue.nextTick()
    wrapper.vm.$store.commit(NEW_REMOTE_PEER_ID, remotePeerId)
    await wrapper.vm.$store.dispatch('myDevices/add', newDeviceCard)
    await wrapper.vm.$store.dispatch('myDevices/setCurrent', remotePeerId)
    wrapper.vm.$store.commit(PEER_CONNECTED)
    // flushPromises() does not take care of the full chain of pending async vuex events
    // which trigger other events. Remote API, watchers, computed, etc.
    // That is why we need to add some sleep or else implement a complex vuex internal state tracking machine.
    await sleep(100)
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.testNotifications = jest.fn()
    store.state.pnp.edgeAPI.enableNotifications = jest.fn()
    wrapper = await mount(DeviceNotificationsConfig, options)
    await Vue.nextTick()
    const testBtn = wrapper.findComponent({ ref: 'test-btn' })
    expect(testBtn.isVisible()).toBeTrue()
    // Test button disabled when notifications are off
    expect(testBtn.props('disabled')).toBe(true)
    await testBtn.trigger('click')
    await Vue.nextTick()
    await flushPromises()
    const testApi = store.state.pnp.edgeAPI.testNotifications
    expect(testApi).toHaveBeenCalledTimes(0)
    const enabler = wrapper.findComponent({ ref: 'notifications-enabled-switch' })
    expect(enabler.isVisible()).toBeTrue()
    // Enable notifications
    await enabler.vm.$emit('change', true)
    await Vue.nextTick()
    await flushPromises()
    await sleep(100)
    const enableApi = store.state.pnp.edgeAPI.enableNotifications
    expect(enableApi).toHaveBeenCalledTimes(1)
    // Now Test button should work
    expect(testBtn.props('disabled')).toBe(false)
    await testBtn.trigger('click')
    await Vue.nextTick()
    expect(testApi).toHaveBeenCalledTimes(1)
  })
})
