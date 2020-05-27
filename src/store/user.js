/* eslint-disable no-console */

/**
  Manage user state
*/
import {
  FIRST_TIME_USER_VISIT,
  RETURNING_USER_VISIT
} from './mutation-types.js'
import {
  USER_VISIT
} from './action-types.js'
const STORAGE_KEY = 'ambianic-user-settings'

const state = {
  /**
    Is this a first time user of the system?
  */
  isReturningUser: window.localStorage.getItem(`${STORAGE_KEY}.isReturningUser`)
}

const mutations = {
  [FIRST_TIME_USER_VISIT] (state) {
    state.isReturningUser = true
    window.localStorage.setItem(`${STORAGE_KEY}.isReturningUser`, true)
  },
  [RETURNING_USER_VISIT] (state) {
  }
}

const actions = {
  /**
  * Update user state according to user visit of the app
  */
  async [USER_VISIT] ({ state, commit }) {
    console.debug('user visiting app')
    if (state.isReturningUser) {
      commit(RETURNING_USER_VISIT)
    } else {
      commit(FIRST_TIME_USER_VISIT)
    }
  }
}

const getters = {
  isFirstTimeUser: state => {
    const isReturningUser = state.isReturningUser
    console.debug({ isReturningUser })
    const isFirstTimeUser = !isReturningUser
    console.debug({ isFirstTimeUser })
    return isFirstTimeUser
  }
}

const userStoreModule = {
  state,
  getters,
  mutations,
  actions
}

export default userStoreModule
