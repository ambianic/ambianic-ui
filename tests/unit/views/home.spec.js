import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

describe('Home Page', () => {
  let wrapper
  const localVue = createLocalVue()

  localVue.use(VueRouter)
  const router = new VueRouter()

  Vue.use(Vuetify)

  let options
  const vuetify = new Vuetify()

  beforeEach(() => {
    options = {
      localVue,
      vuetify,
      router
    }
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  test('Shows home screen title', async () => {
    wrapper = await mount(Home, options)
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const headline = wrapper.findComponent({ ref: 'headline-title' })
    expect(headline.exists()).toBeTrue()
    expect(headline.isVisible()).toBeTrue()
    expect(headline.text()).toContain('Welcome to Ambianic.ai')
  })

  test('Shows Continue button', async () => {
    wrapper = await mount(Home, {
      ...options,
      data () {
        return {
          hasSetupSystem: true
        }
      }
    })
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const btnContinue = wrapper.findComponent({ ref: 'btn-continue' })
    expect(btnContinue.exists()).toBeTrue()
    expect(btnContinue.isVisible()).toBeTrue()
    expect(btnContinue.text()).toContain('Continue')
  })
})
