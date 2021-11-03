import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import DetectionBoxes from '@/components/DetectionBoxes.vue'

describe('DetectionBoxes', () => {
  let wrapper
  const localVue = createLocalVue()

  Vue.use(Vuetify)

  const vuetify = new Vuetify()

  beforeEach(() => {
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should show 2 detection boxes', async () => {
    const rootDiv = document.createElement('div')
    document.body.appendChild(rootDiv)
    wrapper = shallowMount(DetectionBoxes, {
      attachTo: rootDiv,
      localVue,
      vuetify,
      propsData: {
        detections: [
          { box: { xmin: 0.1, xmax: 0.9, ymin: 0.2, ymax: 0.7 } },
          { box: { xmin: 0.2, xmax: 0.3, ymin: 0.4, ymax: 0.8 } }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    console.debug('HTML:\n', wrapper.html())
    const div = await wrapper.find('div')
    console.debug({ div })
    console.debug('div HTML:\n', div.html())
    expect(div.exists()).toBeTruthy()
    expect(div.isVisible()).toBeTruthy()
    const rects = wrapper.findAllComponents({ ref: 'rects' })
    expect(rects.at(0).exists()).toBeTruthy()
    expect(rects.at(0).isVisible()).toBeTruthy()
    expect(rects.at(1).exists()).toBeTruthy()
    expect(rects.at(1).isVisible()).toBeTruthy()
    expect(rects).toHaveLength(2)
  })
})
