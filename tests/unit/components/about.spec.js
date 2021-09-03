import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import About from '@/views/About.vue'
import { pnpStoreModule } from '../../../src/store/pnp'
import snackBarModule from '@/store/status-snackbar'

const appVersion = require('@/../package.json').version

describe('About Page', () => {
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify)
  localVue.use(VueX)

  let store
  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new VueX.Store({
      state: {
        uiAppVersion: appVersion
      },
      modules: {
        pnp: pnpStoreModule,
        snackBar: snackBarModule
      }
    })

    wrapper = mount(About, {
      localVue,
      vuetify,
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('version is retrieved from store', () => {
    const component = mount(About, {
      localVue,
      vuetify,
      store
    })

    const versionElement = component.get('#version-info')
    expect(versionElement.find('#title').text()).toBe(appVersion)
  })
})
