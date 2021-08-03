import { createLocalVue , shallowMount } from '@vue/test-utils'
import pnp from '@/store/pnp.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '@/store/mutation-types'
import Timeline from '@/views/Timeline.vue'
import MockData from '@/assets/mock-data/timeline.json'

jest.mock('peerjs')

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timeline', () => {
  let wrapper
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        pnp: cloneDeep(pnp)
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Timeline page loads detections when PEER is connected', async () => {
    store.state.pnp.peerConnectionStatus = PEER_CONNECTED

    wrapper = shallowMount(Timeline, {
      store,
      localVue
    })

    wrapper.vm.timeline = MockData
    await wrapper.vm.topSpinnerVisibilityChanged(false)
    wrapper.vm.clearTimeline = false

    expect(wrapper.find('#timeline-data').exists()).toBe(true)
  })
})
