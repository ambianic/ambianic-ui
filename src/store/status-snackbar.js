import { LAST_PEER_CONNECTION_STATUS } from './mutation-types'

const state = {
  /**
     * last peer connection status recorded
     */
  lastPeerNotificationStatus: null
}

const mutations = {
  [LAST_PEER_CONNECTION_STATUS] (state, status) {
    state.lastPeerNotificationStatus = status
  }
}

const snackBarModule = {
  state,
  mutations
}

export default snackBarModule
