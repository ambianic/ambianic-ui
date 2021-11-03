import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import About from '@/views/About.vue'
import { pnpStoreModule } from '../../../src/store/pnp'
import { myDevicesStoreModule } from '@/store/mydevices'
import snackBarModule from '@/store/status-snackbar'
import { clone } from 'lodash'
import { PEER_DISCOVER } from '@/store/action-types'

const appVersion = require('@/../package.json').version

describe('About Page', () => {
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
      uiAppVersion: appVersion
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

  test('version is retrieved from store', async () => {
    wrapper = await mount(About, options)
    await wrapper.vm.$nextTick()
    const versionElement = wrapper.findComponent({ ref: 'version-info' })
    expect(versionElement.exists()).toBeTrue()
    expect(versionElement.exists()).toBeTrue()
    expect(versionElement.html()).toContain(appVersion)
  })
})
