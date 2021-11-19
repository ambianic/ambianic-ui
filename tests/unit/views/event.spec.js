import { createLocalVue, mount } from '@vue/test-utils'
import { pnpStoreModule } from '@/store/pnp.js'
import snackBarModule from '@/store/status-snackbar'
import { myDevicesStoreModule } from '@/store/mydevices'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED, PEER_DISCONNECTED } from '@/store/mutation-types'
import Event from '@/views/Event.vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Vue from 'vue'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'

jest.mock('peerjs')

// global import instead of via localVue due to Vuetify 2 Typescript issue:
// ref: https://vuetifyjs.com/en/getting-started/unit-testing/#bootstrapping-vuetify
Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)
// not recommended to use Vuetify with localVue. See note above.
// localVue.use(Vuetify)
localVue.use(VueRouter)

describe('Single Event View Page', () => {
  let wrapper
  let store
  let vuetify
  let router

  // event URL query parameter
  const args = JSON.stringify({
    datetime: '2020-05-10T19:05:45.577145',
    id: 'dde10cb4c3d74e828c473aa183cc8d80',
    image_file_name: '20200510-190545.577145-image.jpg',
    inference_meta: {
      display: 'Object Detection'
    },
    inference_result: [
      {
        box: {
          xmax: 0.7228575944900513,
          xmin: 0.3868940770626068,
          ymax: 1,
          ymin: 0.12535724414170846
        },
        confidence: 0.9921875,
        label: 'person'
      }
    ],
    json_file_name: '20200510-190545.577145-inference.json',
    rel_dir: 'detections/20200510-190544.936209',
    thumbnail_file_name: '20200510-190545.577145-thumbnail.jpg'
  })

  beforeEach(() => {
    vuetify = new Vuetify()

    router = new VueRouter()

    myDevicesStoreModule.actions.syncState = jest.fn()

    store = new Vuex.Store({
      modules: {
        pnp: cloneDeep(pnpStoreModule),
        snackBar: cloneDeep(snackBarModule),
        myDevices: cloneDeep(myDevicesStoreModule)
      }
    })
  })

  afterEach(() => {
    // wrapper.destroy()
  })

  test('Event page loads detections when Event page is visited without query params', async () => {
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    wrapper = mount(Event, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div
    })

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()
    await flushPromises()

    // const html = wrapper.html()
    // console.debug('Event.vue HTML:', { html })

    const eventCard = wrapper.findComponent({ ref: 'event-card' })
    expect(eventCard.exists()).toBeFalse()
    const deviceError = wrapper.findComponent({ ref: 'edge-device-error' })
    expect(deviceError.exists()).toBeTrue()
    expect(deviceError.text()).toEqual('Event query parameters missing.')
    const loadingCard = wrapper.findComponent({ ref: 'loading-card' })
    expect(loadingCard.exists()).toBeTrue()
  })

  test('Event page loads detections when PEER is connected', async () => {
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    const query = {
      priority: 'INFO',
      message: 'Test Event',
      peerid_hash: 'aa6b7832a0ae6c47e9e7c6d58d6d39b0f083f673bb1f3baa870f14e08a3061ea',
      args,
      created: 1589137545.6190686,
      id: 'dde10cb4c3d74e828c473aa183cc8d80',
      source_code: {
        funcName: '_save_sample',
        lineno: 117,
        pathname: '/workspace/src/ambianic/pipeline/store.py'
      }
    }

    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.getLocalImageURL = jest.fn()

    store.state.myDevices.allDeviceCards = new Map()
    store.state.myDevices.allDeviceCards.set('cdbb3227-dabd-4f6f-9cae-a820079f2165', {
      peerID: 'cdbb3227-dabd-4f6f-9cae-a820079f2165',
      displayName: 'Test Device',
      version: '2021.11.18'
    })

    await router.push({ path: '/event', query })

    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    wrapper = mount(Event, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div
    })

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()
    await flushPromises()

    // console.debug('Timeline HTML[' + wrapper.html() + ']')

    const timelineEvent = wrapper.findComponent({ ref: 'event-card' })
    expect(timelineEvent.exists()).toBeTrue()
  })

  test('Event shows error when Event hash does not match a saved user device', async () => {
    store.state.pnp.peerConnectionStatus = PEER_DISCONNECTED

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    const query = {
      priority: 'INFO',
      message: 'Test Event',
      peerid_hash: 'Not_a_matching_event_hash',
      args,
      created: 1589137545.6190686,
      id: 'dde10cb4c3d74e828c473aa183cc8d80',
      source_code: {
        funcName: '_save_sample',
        lineno: 117,
        pathname: '/workspace/src/ambianic/pipeline/store.py'
      }
    }

    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.getLocalImageURL = jest.fn()

    store.state.myDevices.allDeviceCards = new Map()
    store.state.myDevices.allDeviceCards.set('cdbb3227-dabd-4f6f-9cae-a820079f2165', {
      peerID: 'cdbb3227-dabd-4f6f-9cae-a820079f2165',
      displayName: 'Test Device',
      version: '2021.11.18'
    })

    await router.push({ path: '/event', query })

    wrapper = mount(Event, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div
    })

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()
    await flushPromises()

    // console.debug('Timeline HTML[' + wrapper.html() + ']')

    const eventCard = wrapper.findComponent({ ref: 'event-card' })
    expect(eventCard.exists()).toBeFalse()
    const deviceError = wrapper.findComponent({ ref: 'edge-device-error' })
    expect(deviceError.exists()).toBeTrue()
    expect(deviceError.text()).toEqual('Event hash does not match any of your saved devices.')
    const loadingCard = wrapper.findComponent({ ref: 'loading-card' })
    expect(loadingCard.exists()).toBeTrue()
  })
})
