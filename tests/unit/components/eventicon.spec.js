import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import EventIcon from '@/components/EventIcon.vue'
import MockData from '@/assets/mock-data/timeline.json'

import { setTimelineEventColor, setTimelineEventIcon } from '../../../src/components/utils'

describe('EventIcon', () => {
  // global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowMount use
  localVue.use(VueX)

  let store, state, getters
  const mutations = {
    testMutation: jest.fn()
  }

  // global
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter()

  beforeEach(() => {
    store = new VueX.Store({
      state,
      getters,
      mutations
    })

    // using shallowMount with subtree components
    wrapper = mount(EventIcon, {
      localVue,
      vuetify,
      router,
      store,
      propsData: {
        data: MockData[0]
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Displays an icon', () => {
    const iconComponent = wrapper.findComponent({ name: 'EventIcon' })
    const iconWrapper = wrapper.find('.v-avatar')
    const icon = wrapper.find('.v-icon')

    expect(iconComponent.exists()).toBe(true)
    expect(iconWrapper.exists()).toBe(true)
    expect(icon.exists()).toBe(true)
  })

  test('It receives data as props', async () => {
    await wrapper.setProps({ data: MockData[1] })

    expect(wrapper.vm.data).toBe(MockData[1])
  })

  test('timeline event color function returns expected color values', () => {
    let iconColor = setTimelineEventColor()
    expect(iconColor).toBe('white--text primary lighten-2')

    iconColor = setTimelineEventColor('INFO')
    expect(iconColor).toBe('white--text accent lighten-2')

    iconColor = setTimelineEventColor('WARNING')
    expect(iconColor).toBe('white--text warning lighten-2')

    iconColor = setTimelineEventColor('CRITICAL')
    expect(iconColor).toBe('white--text error lighten-2')
  })

  test('timeline event icon function return expected icon', () => {
    let icon = setTimelineEventIcon(MockData[1].args.inference_result)
    expect(icon).toBe('mdi-human')

    icon = setTimelineEventIcon(MockData[2].args.inference_result)
    expect(icon).toBe('mdi-face')

    icon = setTimelineEventIcon(MockData[3].args.inference_result)
    expect(icon).toBe('mdi-car')

    icon = setTimelineEventIcon(MockData[4].args.inference_result)
    expect(icon).toBe('mdi-cat')

    icon = setTimelineEventIcon(MockData[5].args.inference_result)
    expect(icon).toBe('mdi-dog')

    icon = setTimelineEventIcon('')
    expect(icon).toBe('mdi-crosshairs-question')
  })
})
