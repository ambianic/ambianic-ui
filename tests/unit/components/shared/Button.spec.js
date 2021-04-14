import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Button from '@/components/shared/Button.vue'

describe('Button', () => {
  let wrapper
  const localVue = createLocalVue()

  Vue.use(Vuetify)

  const vuetify = new Vuetify()

  beforeEach(() => {
    wrapper = mount(Button, {
      localVue,
      vuetify,
      slots: {
        default: "<h3 class='test'>hello from slot</h3>"
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should load button', () => {
    const button = wrapper.find('.v-btn')
    const badge = wrapper.find('.v-badge')
    const testSlot = wrapper.find('.test')

    console.log(button.attributes())

    expect(button.exists()).toBe(true) // button attribute is on by default
    expect(badge.exists()).toBe(true) // badge attribute is on by default
    // should load the custom slot
    expect(testSlot.exists()).toBe(true)
    expect(testSlot.text()).toBe('hello from slot')
  })
})
