<template>
  <div id="ConnectionStatusSnack-ctn">
    <v-snackbar v-model="visibility">
      <p id="snack-message">
        {{ message }}
      </p>

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
    // this.handleClose()
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
          this.message = 'Connecting to Ambianic Edge device'
          this.visibility = true
          break
        case 'PEER_CONNECTED':
          this.message = 'Connected to Ambianic Edge device'
          this.visibility = true
          break
        case 'PEER_DISCONNECTED':
          this.message = 'Disconnected from Ambianic Edge device'
          this.visibility = true
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
