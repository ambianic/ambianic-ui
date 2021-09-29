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
    const div = document.createElement('div')
    document.body.appendChild(div)
    wrapper = await shallowMount(DetectionBoxes, {
      attachTo: div,
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
    console.debug('HTML', wrapper.html())
    expect(wrapper.find('div').exists()).toBeTrue()
    const rects = wrapper.findAllComponents({ ref: 'rects' })
    expect(rects.at(0).exists()).toBeTrue()
    expect(rects.at(0).isVisible()).toBeTrue()
    expect(rects.at(1).exists()).toBeTrue()
    expect(rects.at(1).isVisible()).toBeTrue()
    expect(rects).toHaveLength(2)
  })
})
