import { INVITATION_REQUEST, CHANGE_STEP_CONTENT_NAME, PWA_INSTALLATION_EVENT, PWA_INSTALLATION_STATUS, CHANGE_INSTALLATION_STEP } from './mutation-types'
import { INSTALL_PWA_APP, INITIATE_PWA_INSTALLATION } from './action-types'

const state = {
  pwaInstallOutcomeMessage: '',
  isAppInstallationComplete: false,
  isInstallingApp: false,
  pwaInstallPrompt: undefined,
  pwaInstallDone: undefined,
  installationStep: 0,
  stepLevel: localStorage.getItem('lastOnboardingStage') || 1,
  stepContentName: localStorage.getItem('lastOnboardingStep') || '',
  invitationDialog: false,
  hasSentAccessRequest: false
}

const mutations = {
  [CHANGE_STEP_CONTENT_NAME] (state, contentName) {
    state.stepContentName = contentName
  },
  [CHANGE_INSTALLATION_STEP] (state, stepNumber) {
    state.stepLevel = stepNumber
  },
  [PWA_INSTALLATION_STATUS] (state, statusObject) {
    const { message, completionState } = statusObject

    state.pwaInstallOutcomeMessage = message
    state.isAppInstallationComplete = completionState
  },
  [INVITATION_REQUEST] (state, invitationObject) {
    const { dialogState, shouldSendAccessRequest } = invitationObject

    state.invitationDialog = dialogState
    state.hasSentAccessRequest = shouldSendAccessRequest
  },
  [PWA_INSTALLATION_EVENT] (state, event) {
    state.pwaInstallPrompt = event
  }
}

const actions = {
  [INITIATE_PWA_INSTALLATION] ({ state, commit, dispatch }, installationObject) {
    const { event, message } = installationObject
    commit(PWA_INSTALLATION_STATUS, { message })

    event.preventDefault()
    console.info('Registered event listener for PWA install prompt.', event)
    commit(PWA_INSTALLATION_EVENT, event)
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

          commit(PWA_INSTALLATION_STATUS, {
            message,
            completionState: true
          })
        } else {
          // userChoice.outcome === "dismissed":

          commit(CHANGE_INSTALLATION_STEP, 2)
          commit(CHANGE_STEP_CONTENT_NAME, 'edge-installation')
          // this.pwaInstallDone('User cancelled install.')
        }
      } catch (e) {
        let message = 'Error during app install.'
        console.warn(message, e)
        message +=
          ' <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installing">Check here</a> to see if your browser supports PWA install.' /
          'Otherwise, you can still bookmark and open the app as a regular web page.'
        // this.pwaInstallDone(message)
        commit(PWA_INSTALLATION_STATUS, {
          message,
          completionState: false
        })
      }
    } else {
      // this.pwaInstallDone('App already installed or browser does not support PWA install.')
      commit(PWA_INSTALLATION_STATUS, {
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
