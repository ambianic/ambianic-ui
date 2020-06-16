import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import Banner from '@/components/shared/Banner.vue'

describe('Banner', () => {
  let wrapper
  const localVue = createLocalVue()

  Vue.use(Vuetify)

  const vuetify = new Vuetify()

  beforeEach(() => {
    wrapper = mount(Banner, {
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should load the banner', () => {
    const banner = wrapper.find('.v-banner')
    const progress = wrapper.find('.v-progress-linear')

    expect(banner.exists()).toBe(true)
    expect(progress.exists()).toBe(false)
  })

  it('should test component props', async () => {
    const banner = wrapper.find('.v-banner')
    const icon = wrapper.find('.v-icon')

    wrapper.setProps({
      icon: 'cog',
      text: 'dummy text',
      progress: true
    })

    await wrapper.vm.$nextTick()

    // checking if we capture the progress bar (loading)
    const newProgressDom = wrapper.find('.v-progress-linear')

    expect(wrapper.props().icon).toBe('cog')
    expect(icon.classes()).toContain('mdi-cog')
    expect(banner.text()).toBe('dummy text')
    expect(newProgressDom.exists()).toBe(true)
  })
})
