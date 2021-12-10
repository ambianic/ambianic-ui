import { createLocalVue, mount } from '@vue/test-utils'
import { pnpStoreModule } from '@/store/pnp.js'
import snackBarModule from '@/store/status-snackbar'
import { myDevicesStoreModule } from '@/store/mydevices'
import { cloneDeep } from 'lodash'
import EventCard from '@/components/EventCard.vue'
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

describe('Event Card Component', () => {
  let wrapper
  let store
  let vuetify
  let router

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

    store.state.pnp.edgeAPI = jest.fn()
    store.state.pnp.edgeAPI.getLocalImageURL = jest.fn()
  })

  afterEach(() => {
    // wrapper.destroy()
  })

  test('Event card should display inference labels', async () => {
    // event data
    const args = {
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
    }

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    wrapper = mount(EventCard, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div,
      propsData: {
        data: {
          priority: 'INFO',
          message: 'Detection Event',
          args
        }
      }
    })

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()
    await flushPromises()

    // const html = wrapper.html()
    // console.debug('Event.vue HTML:', { html })

    const eventTitle = wrapper.findComponent({ ref: 'event-title' })
    expect(eventTitle.exists()).toBeTrue()
    expect(eventTitle.text()).toContain('Detection Event')
    const eventName = wrapper.findComponent({ ref: 'event-display-name' })
    expect(eventName.exists()).toBeTrue()
    expect(eventName.text()).toContain('Object Detection')
    const infItems = wrapper.findAllComponents({ ref: 'inf-item' })
    expect(infItems).toHaveLength(1)
    const infItem = infItems.at(0)
    expect(infItem.exists()).toBeTrue()
    const infLabel = infItem.find('[data-testid="inf-label"]')
    // console.debug('infLabel HTML[' + infLabel.html() + ']')
    // console.debug({ infLabel })
    expect(infLabel.exists()).toBeTrue()
    expect(infLabel.text()).toBe('person')
    const infScore = infItem.find('[data-testid="inf-score"]')
    expect(infScore.exists()).toBeTrue()
    expect(infScore.text()).toContain('99% confidence')
  })

  test('Event card shows idle snapshot events', async () => {
    // idle snapshot event data without inference
    const args = {
      datetime: '2020-05-10T19:05:45.577145',
      id: 'dde10cb4c3d74e828c473aa183cc8d80',
      image_file_name: '20200510-190545.577145-image.jpg',
      inference_meta: {
        display: 'Object Detection'
      },
      inference_result: [],
      json_file_name: '20200510-190545.577145-inference.json',
      rel_dir: 'detections/20200510-190544.936209',
      thumbnail_file_name: '20200510-190545.577145-thumbnail.jpg'
    }

    // create a parent dom for infinite-loader
    const div = document.createElement('div')
    document.body.appendChild(div)

    wrapper = mount(EventCard, {
      router,
      store,
      vuetify,
      localVue,
      attachTo: div,
      propsData: {
        data: {
          priority: 'INFO',
          message: 'Detection Event',
          args
        }
      }
    })

    // wait for the view to load async data and finish rendering
    await Vue.nextTick()
    await flushPromises()

    // const html = wrapper.html()
    // console.debug('Event.vue HTML:', { html })

    const eventTitle = wrapper.findComponent({ ref: 'event-title' })
    expect(eventTitle.exists()).toBeTrue()
    expect(eventTitle.text()).toContain('Idle Snapshot')
    const eventName = wrapper.findComponent({ ref: 'event-display-name' })
    expect(eventName.exists()).toBeTrue()
    expect(eventName.text()).toContain('No Object Detection')
    const infItems = wrapper.findAllComponents({ ref: 'inf-item' })
    expect(infItems).toHaveLength(0)
  })
})
