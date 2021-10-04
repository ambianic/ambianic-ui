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
    const editIcon = listItem.findComponent({ ref: 'icon-start-edit' })
    await editIcon.trigger('click')
    await Vue.nextTick()
    expect(editIcon.isVisible()).toBe(false)
    const nameInput = listItem.findComponent({ ref: 'inputTitleEdit' })
    nameInput.instance().value = 'Kitchen Monitor'
    nameInput.simulate('change')
    const saveIcon = listItem.findComponent({ ref: 'icon-save-edit' })
    saveIcon.simulate('click')
    expect(nameInput.instance().value).toBe('Kitchen Monitor')
    expect(editIcon.isVisible()).toBe(true)
  })
})
