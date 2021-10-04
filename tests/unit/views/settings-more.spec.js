import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Settings from '@/views/Settings.vue'
import { PEER_DISCOVER } from '@/store/action-types'
import { PEER_CONNECTED } from '@/store/mutation-types'
import { cloneDeep } from 'lodash'
import edgeDevice from '@/store/edge-device.js'
import { pnpStoreModule } from '../../../src/store/pnp'
import snackBarModule from '@/store/status-snackbar'

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
    await wrapper.destroy()
  })

  test('should edit and save custom edge display name', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '0da0d142-9859-4371-96b7-decb180fcd37'
    // mock edgeAPI instance
    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.setDeviceDisplayName = jest.fn()
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
    let editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeTrue()
    await editIcon.trigger('click')
    editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    expect(editIcon.exists()).toBeFalse()
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
})
