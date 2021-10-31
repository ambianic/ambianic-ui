import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { pnpStoreModule } from '@/store/pnp'
import { myDevicesStoreModule } from '@/store/mydevices'
import snackBarModule from '@/store/status-snackbar'
import { clone } from 'lodash'
import { PEER_DISCOVER } from '@/store/action-types'
import Help from '@/views/Help.vue'

describe('Help Page', () => {
  let wrapper
  const localVue = createLocalVue()

  localVue.use(VueRouter)
  const router = new VueRouter()

  Vue.use(Vuetify)
  localVue.use(VueX)

  let options
  const vuetify = new Vuetify()

  beforeEach(() => {
    const state = {
    }

    const modules = {
      pnp: clone(pnpStoreModule),
      snackBar: clone(snackBarModule),
      myDevices: clone(myDevicesStoreModule)
    }

    const getters = {
    //   ...
    }

    const actions = {
      [PEER_DISCOVER] (context) {
      }
    }

    const mutations = {
    }

    const store = new VueX.Store(
      {
        state,
        getters,
        mutations,
        actions,
        modules
      }
    )

    options = {
      localVue,
      vuetify,
      router,
      store
    }
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Shows docs link', async () => {
    wrapper = await mount(Help, options)
    await wrapper.vm.$nextTick()
    const title = wrapper.findComponent({ ref: 'help-title' })
    expect(title.exists()).toBeTrue()
    expect(title.find('span').text()).toBe('Need Help with Ambianic?')
    const docs = wrapper.findComponent({ ref: 'btn-docs' })
    expect(docs.exists()).toBeTrue()
    expect(docs.props('href')).toEqual('https://docs.ambianic.ai')
  })
})
