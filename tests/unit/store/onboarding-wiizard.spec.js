import { createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import { cloneDeep } from 'lodash'
import onboardingWizard, { ONBOARDING_STEP_NUMBER_KEY, ONBOARDING_CONTENT_NAME_KEY } from '@/store/onboarding-wizard.js'
import { pnpStoreModule } from '@/store/pnp.js'
import {
  ONBOARDING_CHANGE_INSTALLATION_STEP,
  ONBOARDING_CHANGE_STEP_CONTENT_NAME, ONBOARDING_INVITATION_REQUEST, ONBOARDING_PWA_INSTALLATION_STATUS, ONBOARDING_PWA_INSTALLATION_EVENT
} from '@/store/mutation-types'
import { INITIATE_PWA_INSTALLATION, INSTALL_PWA_APP } from '../../../src/store/action-types'

describe('Edge Device module', () => {
  const localVue = createLocalVue()
  const sampleOutcomeMessage = 'Browser supports PWA install.'

  let store

  // global
  localVue.use(VueX)

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn()
    global.Storage.prototype.getItem = jest.fn()
    global.Storage.prototype.removeItem = jest.fn()
  })

  beforeEach(() => {
    store = new VueX.Store({
      modules: {
        onboardingWizard: cloneDeep(onboardingWizard),
        pnp: cloneDeep(pnpStoreModule)
      }
    })
  })

  test('Mounted component contains an `onboardingWizard` module', () => {
    expect(store.state).toHaveProperty('onboardingWizard')
  })

  test('`PWA_INSTALLATION_STATUS` mutation sets pwaInstallationOutcomeMessage & isAppInstallationComplete state', () => {
    expect(store.state.onboardingWizard.isAppInstallationComplete).toBeFalsy()
    expect(store.state.onboardingWizard.pwaInstallOutcomeMessage).toBe('')

    store.commit(ONBOARDING_PWA_INSTALLATION_STATUS, {
      message: sampleOutcomeMessage,
      completionState: true
    })

    expect(store.state.onboardingWizard.isAppInstallationComplete).toBeTruthy()
    expect(store.state.onboardingWizard.pwaInstallOutcomeMessage).toBe(sampleOutcomeMessage)
  })

  test('`ONBOARDING_INVITATION_REQUEST` controls onboardingDialog visibility', () => {
    expect(store.state.onboardingWizard.invitationDialog).toBeFalsy()

    store.commit(ONBOARDING_INVITATION_REQUEST, {
      dialogState: true,
      shouldSendAccessRequest: true
    })

    expect(store.state.onboardingWizard.invitationDialog).toBeTruthy()
  })

  test('`INITIATE_PWA_INSTALLATION` launches PWA installation', () => {
    expect(store.state.onboardingWizard.pwaInstallPrompt).toBeFalsy()

    store.dispatch(INITIATE_PWA_INSTALLATION, {
      event: {
        preventDefault: jest.fn()
      },
      message: sampleOutcomeMessage
    })

    expect(store.state.onboardingWizard.pwaInstallPrompt.preventDefault).toHaveBeenCalled()
  })

  // `onbeforeinstall` prompt is tested using cypress in onboardingpwa.spec.js
  test('`INSTALL_PWA_APP` installs PWA', () => {
    store.commit(
      ONBOARDING_PWA_INSTALLATION_EVENT, {
        prompt: jest.fn(),
        userChoice: new Promise((resolve, reject) => {
          resolve({
            outcome: 'accepted'
          })
        })
      }
    )

    store.dispatch(INSTALL_PWA_APP)
    expect(store.state.onboardingWizard.pwaInstallPrompt.prompt).toHaveBeenCalled()

    // wait 1ms for the userChoice promise to resolve
    setTimeout(() => {
      expect(store.state.onboardingWizard.pwaInstallOutcomeMessage).toBe('Ambianic can be now accessed as a native home screen app on this device.')
      expect(store.state.onboardingWizard.pwaInstallOutcomeMessage).toBe(false)
    }, 1000)
  })

  it('Should persist user onboarding progress', () => {
    store.commit(ONBOARDING_CHANGE_STEP_CONTENT_NAME, 'edge-installation')
    expect(window.localStorage.setItem).toHaveBeenCalled()
    expect(window.localStorage.setItem).toHaveBeenCalledWith(ONBOARDING_CONTENT_NAME_KEY, 'edge-installation')

    store.commit(ONBOARDING_CHANGE_INSTALLATION_STEP, 2)
    expect(window.localStorage.setItem).toHaveBeenCalled()
    expect(window.localStorage.setItem).toHaveBeenCalledWith(ONBOARDING_STEP_NUMBER_KEY, 2)
  })
})
