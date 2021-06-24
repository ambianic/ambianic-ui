<template>
  <v-dialog
    id="notification-dialog"
    persistent
    v-model="showEdgeSyncModal"
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
              Ambianic Edge Device Sync
            </h3>
          </div>

          <div
            class="icon"
            @click="handleClose('DENIED')"
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

        <div>
          <div v-if="EDGE_SYNC_COMPATIBILITY_STATUS === 'CHECKING'">
            <br>
            <v-progress-circular
              indeterminate
              :width="3.5"
              id="compatibile-spinner"
              :size="40"
              color="primary"
            />
            <br>
            <br>
            <p id="checker-text">
              Checking if your connected Edge Device is compatible with Ambianic Premium Services.
            </p>
            <br>
          </div>

          <v-list v-if="EDGE_SYNC_COMPATIBILITY_STATUS === 'OUTDATED'">
            <br>
            <div class="align-center">
              <v-icon
                style="margin: 0;"
                center
                id="outdated-icon"
                size="45"
              >
                mdi-alert-outline
              </v-icon>
            </div>
            <br>
            <p id="outdated-text">
              Your Edge Device is currently running on version {{ edgeVersion }} and is missing the new <a href="https://docs.ambianic.ai/users/premium-services/">Premium Services</a> feature.
            </p>
            <br>

            <hr>
            <div
              class="flex"
              style="margin: .5rem 0 0 0"
            >
              <div class="align-center">
                <p style="margin: 0 .3rem; font-size: .95rem">
                  Your Ambianic Edge device is running an outdated software version. It should automatically update to the latest version within 24 hours. Please try again later or contact support if the issue persists.
                </p>
              </div>
            </div>
          </v-list>

          <div v-if="EDGE_SYNC_COMPATIBILITY_STATUS === 'COMPATIBLE'">
            <v-list v-if="!isEdgeSynced">
              <br>
              <v-progress-circular
                indeterminate
                :width="3.5"
                id="loading-sync"
                :size="40"
                color="primary"
              />
              <br>
              <br>
              <p id="loading-explanation">
                Your premium subscription is being extended to your connected Edge Device.
              </p>
              <br>
            </v-list>

            <v-list v-else>
              <v-icon
                style="margin: 0.5rem 0;"
                center
                id="success-icon"
                size="60"
              >
                mdi-check-circle-outline
              </v-icon>

              <p id="explanation">
                Your premium subscription has been successfully extended to your connected Edge Device. <br> <br> You will now receive email notifications about detections events from your running edge device.
              </p>

              <v-btn
                color="primary"
                :disabled="!isEdgeSynced"
                id="dismiss-button"
                @click="handleClose('GRANTED')"
              >
                Okay, I understand
              </v-btn>
            </v-list>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { PEER_CONNECTED } from '@/store/mutation-types'
import {
  FETCH_EDGE_DEVICE_DETAILS,
  HANDLE_EDGE_SYNC_DIALOG
} from '@/store/action-types'
import { EdgeAPI } from '@/remote/edgeAPI'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'EdgeAuth0Sync',
  data: (_) => ({
    isEdgeSynced: false,
    EDGE_SYNC_COMPATIBILITY_STATUS: 'CHECKING'
  }),
  computed: {
    ...mapState({
      showEdgeSyncModal: state => state.premiumService.showEdgeSyncModal,
      isEdgeConnected: (state) =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: (state) => state.pnp,
      user: state => state.premiumService.user,
      edgeVersion: state => state.edgeVersion
    })
  },
  created () {
    this.edgeAPI = new EdgeAPI(this.pnp)
    if (this.isEdgeConnected) {
      this.fetchEdgeDetails()
    }
  },
  methods: {
    ...mapActions([HANDLE_EDGE_SYNC_DIALOG, FETCH_EDGE_DEVICE_DETAILS]),
    handleClose (state) {
      localStorage.setItem('edgeSyncStatus', JSON.stringify({ status: state }))

      this.$store.dispatch(HANDLE_EDGE_SYNC_DIALOG, false)
    },
    async fetchEdgeDetails () {
      try {
        const data = await this.edgeAPI.getEdgeStatus()
        await this.$store.dispatch(FETCH_EDGE_DEVICE_DETAILS, data)
      } catch (e) {
        console.log(e)
      }

      this.checkEdgeSyncCompatibility()
    },
    async submitUserId () {
      try {
        await this.edgeAPI
          .initializePremiumNotification(this.user.sub)

        this.isEdgeSynced = true
      } catch (e) {
        console.log('error submitting user id')
      }
    },
    checkEdgeSyncCompatibility () {
      if (parseFloat(this.edgeVersion) <= parseFloat('1.14.7')) {
        this.EDGE_SYNC_COMPATIBILITY_STATUS = 'OUTDATED'
      } else {
        this.EDGE_SYNC_COMPATIBILITY_STATUS = 'COMPATIBLE'
        this.submitUserId()
      }
    }
  },
  watch: {
    /*
    Certain important functions are (re)executed here to handle scenarios
    when an edge device (re)connects after the component is fully
    mounted.
     */

    isEdgeConnected: function (value) {
      if (value) {
        this.checkEdgeSyncCompatibility()
        this.fetchEdgeDetails()
      }
    },

    edgeVersion: function () {
      this.checkEdgeSyncCompatibility()
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

</style>
