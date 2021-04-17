<template>
  <v-dialog
    id="notification-dialog"
    persistent
    v-model="showModal"
    max-width="550"
  >
    <v-card>
      <div class="container">
        <div
          class="flex"
          style="justify-content: space-between;"
        >
          <div class="align-center">
            <h3 style="font-weight: normal;">
              Ambianic Edge Device
            </h3>
          </div>

          <div
            class="icon"
            @click="handleClose()"
          >
            <v-icon
              style="margin: 0.5rem 0;"
              center
              id="close-icon"
              size="25"
            >
              mdi-close
            </v-icon>
          </div>
        </div>

        <hr>
        <v-list>
          <v-icon
            style="margin: 0.5rem 0;"
            center
            id="success-icon"
            size="60"
          >
            mdi-check-circle-outline
          </v-icon>

          <v-text id="explanation">
            Your premium subscription has been successfully extended to your connected Edge Device. <br> <br> You would now get email notifications about object detections from your running edge device.
          </v-text>

          <v-btn
            color="primary"
            id="dismiss-button"
            @click="handleClose()"
          >
            Okay, I understand
          </v-btn>
        </v-list>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  PEER_CONNECTED
} from '@/store/mutation-types'
import { EdgeAPI } from '@/remote/edgeAPI'
import { mapState } from 'vuex'

export default {
  name: 'EdgeAuth0Sync',
  data: (_) => ({
    showModal: true
  }),
  computed: {
    ...mapState({
      peerConnectionStatus: (state) => state.pnp.peerConnectionStatus,
      isEdgeConnected: (state) =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: (state) => state.pnp.remotePeerId,
      peerFetch: (state) => state.pnp.peerFetch,
      pnp: (state) => state.pnp
    })
  },
  created () {
    this.edgeAPI = new EdgeAPI(this.pnp)

    if (this.isEdgeConnected) {
      this.submitUserId()
    }
  },
  methods: {
    handleClose () {
      localStorage.setItem('edgeSyncStatus', JSON.stringify({ isSynced: false }))

      this.showModal = false
    },
    submitUserId () {
      this.edgeAPI
        .initializePremiumNotification(this.$auth.user.sub)
        .catch((e) => {
          console.log('ERROR RESPONSE FROM EDGE', e)
        })
    }
  },
  watch: {
    isEdgeConnected: function (value) {
      if (value) {
        this.submitUserId()
      }
    }
  }
}
</script>

<style scoped>
.container {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.flex {
  display: flex;
  justify-content: center;
}

.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon:hover {
  cursor: pointer;
}

.code {
  font-weight: bold;
}
</style>
