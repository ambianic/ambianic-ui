import { ONBOARDING_INVITATION_REQUEST, ONBOARDING_CHANGE_STEP_CONTENT_NAME, ONBOARDING_PWA_INSTALLATION_EVENT, ONBOARDING_PWA_INSTALLATION_STATUS, ONBOARDING_CHANGE_INSTALLATION_STEP } from './mutation-types'
import { INSTALL_PWA_APP, INITIATE_PWA_INSTALLATION } from './action-types'

export const ONBOARDING_STAGE_KEY = 'ambianic-onboarding-stage'
export const ONBOARDING_CONTENT_KEY = 'ambianic-onboarding-content'

const state = {
  pwaInstallOutcomeMessage: '',
  isAppInstallationComplete: false,
  isInstallingApp: false,
  pwaInstallPrompt: undefined,
  pwaInstallDone: undefined,
  installationStep: 0,
  stepLevel: localStorage.getItem(ONBOARDING_STAGE_KEY) || 1,
  stepContentName: localStorage.getItem(ONBOARDING_CONTENT_KEY) || '',
  invitationDialog: false,
  hasSentAccessRequest: false
}

const mutations = {
  [ONBOARDING_CHANGE_STEP_CONTENT_NAME] (state, contentName) {
    state.stepContentName = contentName

    localStorage.setItem(ONBOARDING_CONTENT_KEY, contentName)
  },
  [ONBOARDING_CHANGE_INSTALLATION_STEP] (state, stepNumber) {
    state.stepLevel = stepNumber

    localStorage.setItem(ONBOARDING_STAGE_KEY, stepNumber)
  },
  [ONBOARDING_PWA_INSTALLATION_STATUS] (state, statusObject) {
    const { message, completionState } = statusObject

    state.pwaInstallOutcomeMessage = message
    state.isAppInstallationComplete = completionState
  },
  [ONBOARDING_INVITATION_REQUEST] (state, invitationObject) {
    const { dialogState, shouldSendAccessRequest } = invitationObject

    state.invitationDialog = dialogState
    state.hasSentAccessRequest = shouldSendAccessRequest
  },
  [ONBOARDING_PWA_INSTALLATION_EVENT] (state, event) {
    state.pwaInstallPrompt = event
  }
}

const actions = {
  [INITIATE_PWA_INSTALLATION] ({ state, commit, dispatch }, installationObject) {
    const { event, message } = installationObject
    commit(ONBOARDING_PWA_INSTALLATION_STATUS, { message })

    event.preventDefault()
    console.info('Registered event listener for PWA install prompt.', event)
    commit(ONBOARDING_PWA_INSTALLATION_EVENT, event)
  },

  async [INSTALL_PWA_APP] ({ state, commit, _ }) {
    state.isInstallingApp = true

    if (state.pwaInstallPrompt) {
      try {
        state.pwaInstallPrompt.prompt()
        // Wait for the user to respond to the prompt
        const { outcome } = await state.pwaInstallPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        if (outcome === 'accepted') {
          const message = 'Ambianic can be now accessed as a native home screen app on this device.'

          commit(ONBOARDING_PWA_INSTALLATION_STATUS, {
            message,
            completionState: true
          })
        } else {
          commit(ONBOARDING_CHANGE_INSTALLATION_STEP, 2)
          commit(ONBOARDING_CHANGE_STEP_CONTENT_NAME, 'edge-installation')
        }
      } catch (e) {
        let message = 'Error during app install.'
        console.warn(message, e)
        message +=
          ' <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installing">Check here</a> to see if your browser supports PWA install.' /
          'Otherwise, you can still bookmark and open the app as a regular web page.'
        // this.pwaInstallDone(message)
        commit(ONBOARDING_PWA_INSTALLATION_STATUS, {
          message,
          completionState: true
        })
      }
    } else {
      // this.pwaInstallDone('App already installed or browser does not support PWA install.')
      commit(ONBOARDING_PWA_INSTALLATION_STATUS, {
        message: 'App already installed or browser does not support PWA install.',
        completionState: true
      })
    }
  }
}

const onboardingWizard = {
  state,
  mutations,
  actions
}

export default onboardingWizard
