import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { pnpStoreModule } from '@/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { clone } from 'lodash'
import { PEER_DISCOVER } from '@/store/action-types'
import Onboarding from '@/views/Onboarding.vue'
import OnboardingWizard from '@/store/onboarding-wizard'

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
    }

    const modules = {
      pnp: clone(pnpStoreModule),
      snackBar: clone(snackBarModule),
      onboardingWizard: OnboardingWizard
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

  test('Shows initial install headline', async () => {
    wrapper = await mount(Onboarding, options)
    await wrapper.vm.$nextTick()
    console.debug({ wrapper })
    const headline = wrapper.findComponent({ ref: 'headline' })
    expect(headline.exists()).toBeTrue()
    expect(headline.isVisible()).toBeTrue()
  })
})
