import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import { pnpStoreModule } from '@/store/pnp'
import snackBarModule from '@/store/status-snackbar'
import { clone } from 'lodash'
import Onboarding from '@/views/Onboarding.vue'
import OnboardingWizard from '@/store/onboarding-wizard'

describe('Onboarding Page', () => {
  let wrapper, store
  const localVue = createLocalVue()

  localVue.use(VueRouter)
  const router = new VueRouter()

  Vue.use(Vuetify)
  localVue.use(VueX)

  let options
  const vuetify = new Vuetify()

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        pnp: clone(pnpStoreModule),
        snackBar: clone(snackBarModule),
        onboardingWizard: OnboardingWizard
      }
    })

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

  test('SubmitPeerId stores remotePeerId', async () => {
    const SAMPLE_REMOTE_ID = '0ad32ad4-4a7e-4c08-8ec7-2806ac236702'
    wrapper = await mount(Onboarding, options)

    wrapper.vm.submitPeerId(SAMPLE_REMOTE_ID)
    expect(store.state.pnp.remotePeerId).toBe(SAMPLE_REMOTE_ID)
  })

  test('`cancelConnectionWithExistingRemoteId` removes remotePeerId', async () => {
    wrapper = await mount(Onboarding, options)

    wrapper.vm.cancelConnectionWithExistingRemoteId()
    expect(store.state.pnp.remotePeerId).toBe(undefined)
    expect(wrapper.vm.recievedPeerID).toBe('')
  })
})
