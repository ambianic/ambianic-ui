<template>
  <div id="ConnectionStatusSnackbar-ctn">
    <v-snackbar
      v-model="visibility"
      data-cy="snackbar"
    >
      <span id="snack-message">
        {{ message }}
      </span>

      <template #action="{ attrs }">
        <div
          v-bind="attrs"
          id="close-icon"
          @click="handleClose"
        >
          <Button
            icon="close"
            color="white"
          />
        </div>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AmbButton from '@/components/shared/Button'
import { PEER_CONNECTED_NOTIFICATION, PEER_DISCONNECTED_NOTIFICATION, PEER_CONNECTING_NOTIFICATION } from '@/components/utils'
import { LAST_PEER_CONNECTION_STATUS } from '@/store/mutation-types'

export default {
  name: 'ConnectionStatusSnackbar',
  data: () => ({
    visibility: false,
    message: 'Connecting to Ambianic Edge device'
  }),
  components: {
    Button: AmbButton
  },
  created () {
    this.setConnectionStatusNotification()
  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      lastConnectionStatus: state => state.snackBar.lastPeerNotificationStatus
    })
  },
  methods: {
    handleClose () {
      this.visibility = false
    },
    setConnectionStatusNotification () {
      if (this.lastConnectionStatus !== this.peerConnectionStatus) {
        switch (this.peerConnectionStatus) {
          case 'PEER_CONNECTING':
            return this.setNotification(PEER_CONNECTING_NOTIFICATION)

          case 'PEER_CONNECTED':
            return this.setNotification(PEER_CONNECTED_NOTIFICATION)

          case 'PEER_DISCONNECTED':
            return this.setNotification(PEER_DISCONNECTED_NOTIFICATION)

          default:
            break
        }
      }
    },
    setNotification (message) {
      this.message = message
      this.visibility = true
      this.$store.commit(LAST_PEER_CONNECTION_STATUS, this.peerConnectionStatus)
    }
  },
  watch: {
    peerConnectionStatus: function () {
      this.setConnectionStatusNotification()
    }
  }
}
</script>

<style>
#snack-message {
  padding-top: 5px;
  font-size: .9rem;
}
</style>
