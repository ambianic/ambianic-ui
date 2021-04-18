import { mount, createLocalVue } from '@vue/test-utils'
import pnp from '@/store/pnp.js'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { PEER_CONNECTED } from '../../../../src/store/mutation-types'
import { PEER_DISCOVER } from '../../../../src/store/action-types'
import Timeline from '../../../../src/views/Timeline.vue'

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

  // afterEach(() => {
  //   wrapper.destroy()
  // })

  test('LOAD_DATA when peer is connected', async () => {
    wrapper = mount(Timeline, {
      store,
      localVue
    })

    store.state.pnp.peerConnectionStatus = PEER_CONNECTED
    store.state.pnp.remotePeerId = '917d5f0a-6469-4d33-b5c2-efd858118b74'
    await store.dispatch(PEER_DISCOVER)

    const mockBtn = wrapper.find('#load-mock-data')

    mockBtn.trigger('click')

    expect(wrapper.find('#connectionCard').exists()).toBe(false)

    expect(wrapper.find('#timeline-data').exists()).toBe(true)
  })
})
