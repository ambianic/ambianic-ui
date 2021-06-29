import {
  HANDLE_SUBSCRIPTION_DIALOG,
  HANDLE_EDGE_SYNC_DIALOG,
  FETCH_USER_SUBSCRIPTION, SAVE_AUTHENTICATED_USER
} from './action-types'
import { SUBSCRIPTION, SUBSCRIPTION_DIALOG, EDGE_SYNC_DIALOG, USER_DATA } from './mutation-types'

const state = {
  showSubscriptionDialog: true,
  showEdgeSyncModal: false,

  subscriptionDetails: null,
  loadingSubscription: false,

  isAuthenticated: false,
  user: {},
  loadingAuth: true
}

const mutations = {
  [SUBSCRIPTION_DIALOG] (state, visibility) {
    state.showSubscriptionDialog = visibility
  },
  [EDGE_SYNC_DIALOG] (state, visibility) {
    state.showEdgeSyncModal = visibility
  },
  [SUBSCRIPTION] (state, data) {
    state.loadingSubscription = false

    state.subscriptionDetails = data
  },
  [USER_DATA] (state, data) {
    state.isAuthenticated = data.isAuthenticated

    state.user = data.user

    state.loadingAuth = data.loadingAuth
  }
}

export const handleSubscriptionStatus = (status, endDate) => {
  switch (status) {
    case 'past_due':
      return { status: `Expired ${endDate}`, shouldRenew: true }

    case 'active':
      return {
        status: `Expires ${endDate}`,
        shouldRenew: false,
        canCancel: true
      }

    case 'incomplete_expired':
      return { status: `Expired ${endDate}`, shouldRenew: true }

    case 'incomplete':
      return { status: `Expired ${endDate}`, shouldRenew: true }

    case 'canceled':
      return {
        status: `Active till ${endDate}`,
        shouldRenew: false,
        canCancel: false
      }

    default:
      return { error: `status: ${status} unrecognized` }
  }
}

const actions = {
  [HANDLE_SUBSCRIPTION_DIALOG] ({ commit }, visibility) {
    commit(SUBSCRIPTION_DIALOG, visibility)
  },

  [HANDLE_EDGE_SYNC_DIALOG] ({ commit }, visibility) {
    commit(EDGE_SYNC_DIALOG, visibility)
  },

  async [FETCH_USER_SUBSCRIPTION] ({ commit }, userId) {
    if (userId) {
      try {
        const req = await fetch(
        `${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription-data?userId=${userId}`
        )
        const request = await req.json()
        commit(SUBSCRIPTION, request)
      } catch (e) {
        console.log(e, 'FETCH SUB ERROR')
        commit(SUBSCRIPTION, null)
      }
    }
  },

  [SAVE_AUTHENTICATED_USER] ({ commit }, data) {
    commit(USER_DATA, data)
  }
}

const premiumServiceModule = {
  state,
  mutations,
  actions
}

export default premiumServiceModule
