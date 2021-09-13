import { createLocalVue, mount } from '@vue/test-utils'
import { pnpStoreModule } from '@/store/pnp.js'
import snackBarModule from '@/store/status-snackbar'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '@/store/mutation-types'
import Timeline from '@/views/Timeline.vue'
import MockData from '@/assets/mock-data/timeline.json'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Vue from 'vue'
import VueRouter from 'vue-router'

jest.mock('peerjs')

// global import instead of via localVue due to Vuetify 2 Typescript issue:
// ref: https://vuetifyjs.com/en/getting-started/unit-testing/#bootstrapping-vuetify
Vue.use(Vuetify)

const localVue = createLocalVue()

localVue.use(Vuex)
// not recommended to use Vuetify with localVue. See note above.
// localVue.use(Vuetify)
localVue.use(VueRouter)

describe('Timeline', () => {
  let wrapper
  let store
  let vuetify
  let router

  beforeEach(() => {
    vuetify = new Vuetify()

    router = new VueRouter()

    store = new Vuex.Store({
      modules: {
        pnp: cloneDeep(pnpStoreModule),
        snackBar: cloneDeep(snackBarModule)
      }
    })
  })

  afterEach(() => {
    // wrapper.destroy()
  })

  test('Timeline page loads detections when PEER is connected', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    wrapper = mount(Timeline, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div
    })

    wrapper.vm.timeline = MockData
    await wrapper.vm.topSpinnerVisibilityChanged(false)
    wrapper.vm.clearTimeline = false

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()

    // console.debug('Timeline HTML[' + wrapper.html() + ']')

    const timelineEvents = wrapper.findAllComponents({ ref: 'timeline-data' })
    expect(timelineEvents).toHaveLength(8)
  })
})
