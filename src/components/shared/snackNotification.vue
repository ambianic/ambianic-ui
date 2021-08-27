<template>
  <div id="ConnectionStatusSnack-ctn">
    <v-snackbar v-model="visibility">
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

export default {
  name: 'ConnectionStatusSnack',
  data: () => ({
    visibility: true,
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
      peerConnectionStatus: state => state.pnp.peerConnectionStatus
    })
  },
  methods: {
    handleClose () {
      this.visibility = false
    },
    setConnectionStatusNotification () {
      switch (this.peerConnectionStatus) {
        case 'PEER_CONNECTING':
          this.visibility = this.message !== PEER_CONNECTING_NOTIFICATION
          this.message = PEER_CONNECTING_NOTIFICATION
          break
        case 'PEER_CONNECTED':
          this.visibility = this.message !== PEER_CONNECTED_NOTIFICATION
          this.message = PEER_CONNECTED_NOTIFICATION
          break
        case 'PEER_DISCONNECTED':
          this.visibility = this.message !== PEER_DISCONNECTED_NOTIFICATION
          this.message = PEER_DISCONNECTED_NOTIFICATION
          break
        default:
          break
      }
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
