import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { pnpStoreModule } from '@/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { clone } from 'lodash'
import { PEER_DISCOVER } from '@/store/action-types'
import Feedback from '@/views/Feedback.vue'

describe('Feedback Page', () => {
  let wrapper
  const localVue = createLocalVue()

  localVue.use(VueRouter)
  const router = new VueRouter()

  Vue.use(Vuetify)
  localVue.use(VueX)

  let options
  const vuetify = new Vuetify()

  beforeEach(() => {
    const state = {
      uiAppVersion: appVersion
    }

    const modules = {
      pnp: clone(pnpStoreModule),
      snackBar: clone(snackBarModule)
    }

    const getters = {
    //   ...
    }

    const actions = {
      [PEER_DISCOVER] (context) {
      }
    }

    const mutations = {
    }

    const store = new VueX.Store(
      {
        state,
        getters,
        mutations,
        actions,
        modules
      }
    )

    options = {
      localVue,
      vuetify,
      router,
      store
    }
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Offers github issues button', async () => {
    wrapper = await mount(Feedback, options)
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const appFrame = wrapper.findComponent({ ref: 'app-frame' })
    expect(appFrame.exists()).toBeTrue()
    console.debug({ appFrame })
    const feedbackListItem = wrapper.findComponent({ ref: 'feedback-title' })
    console.debug('feedbackListItem HTML', feedbackListItem.html())
    expect(feedbackListItem.exists()).toBeTrue()
    console.debug('feedbackListItem props', feedbackListItem.props())
    expect(feedbackListItem.props('title')).toEqual('Send Feedback')
    const feedbackButton = wrapper.findComponent({ ref: 'btn-feedback' })
    console.debug('feedbackButton HTML', feedbackButton.html())
    expect(feedbackButton.exists()).toBeTrue()
    console.debug('feedbackButton props', feedbackButton.props())
    expect(feedbackButton.props('href')).toEqual('https://github.com/ambianic/ambianic-ui/issues')
  })
})
