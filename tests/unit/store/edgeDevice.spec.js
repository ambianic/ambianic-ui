import { mount, createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import Setting from '@/views/Settings.vue'
import { cloneDeep } from 'lodash'
import edgeDevice from '@/store/edge-device.js'
import { pnpStoreModule } from '@/store/pnp.js'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { EDGE_DEVICE_DETAILS } from '@/store/mutation-types'

describe('Edge Device module', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(VueX)
  Vue.use(Vuetify) // for shallowshallowMount use
  const vuetify = new Vuetify()

  let store

  // global
  localVue.use(VueRouter)

  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        edgeDevice: cloneDeep(edgeDevice),
        pnp: cloneDeep(pnpStoreModule)
      }
    })

    // using shallowMount with subtree components
    wrapper = mount(Setting, {
      localVue,
      router,
      store,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Edge Device module contains empty `edgeSoftwareVersion` state', () => {
    expect(wrapper.vm.$store.edgeSoftwareVersion).toBeFalsy()
  })

  test('`EDGE_DEVICE_DETAILS` mutates `edgeSoftwareVersion` state', () => {
    expect(wrapper.vm.$store.edgeSoftwareVersion).toBeFalsy()

    wrapper.vm.$store.commit(EDGE_DEVICE_DETAILS, {
      status: 'OK',
      version: '1.5.1'
    })

    expect(wrapper.vm.version).toBe('1.5.1')
  })

  test('`EDGE_DEVICE_DETAILS` ignores payload without `version` field', () => {
    expect(wrapper.vm.$store.edgeSoftwareVersion).toBeFalsy()

    wrapper.vm.$store.commit(EDGE_DEVICE_DETAILS, {
      status: 'OK'
    })

    expect(wrapper.vm.$store.edgeSoftwareVersion).toBeFalsy()
  })
})
