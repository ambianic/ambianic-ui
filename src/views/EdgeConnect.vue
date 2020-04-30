<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
      <v-col
        v-if="edgePeerId"
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-banner
          v-if="isEdgeConnected"
          two-line
          class="text-left"
        >
          <v-icon
            slot="icon"
            size="36"
          >
            mdi-wifi
          </v-icon>
          Ambianic Edge device connected!
        </v-banner>
        <v-banner
          v-else
          two-line
          class="text-left"
        >
          <v-icon
            slot="icon"
            size="36"
          >
            mdi-wifi-off
          </v-icon>
          Connecting to Ambianic Edge device...
          <v-progress-linear
            color="info"
            indeterminate
            :size="50"
            :width="7"
          />
        </v-banner>
        <v-card
          class="mx-auto text-left"
        >
          <v-list
            two-line
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-tag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>My Ambianic Edge Device</v-list-item-title>
                <v-list-item-subtitle>Display Name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider
              inset
            />
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-identifier</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ edgePeerId }}</v-list-item-title>
                <v-list-item-subtitle>Peer ID</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-alpha-v</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ version }}</v-list-item-title>
                <v-list-item-subtitle>Release Version</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-btn
            text
            :to="'timeline'"
          >
            OK
          </v-btn>
          <router-link :to="'choose-edge-connection'">
            <v-btn>Disconnect</v-btn>
          </router-link>
        </v-card>
      </v-col>
      <v-col
        v-else
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-banner
          two-line
          class="text-left"
        >
          <v-icon
            slot="icon"
            size="36"
          >
            mdi-wifi-off
          </v-icon>
          Let's find your Ambianic Edge device and connect to it...
        </v-banner>

        <v-stepper
          v-model="connectStep"
          vertical
        >
          <v-stepper-step
            :complete="connectStep > 1"
            step="1"
            :rules="[() => true]"
          >
            Discovering
            <small>Looking for Ambianic Edge device to pair with.</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-progress-linear
              color="info"
              indeterminate
              :size="50"
              :width="7"
            />
            <v-alert
              v-if="this.$store.state.pnp.userMessage"
              outlined
              type="warning"
              class="mt-5 text-left"
              dense
            >
              {{ this.$store.state.pnp.userMessage }}
            </v-alert>

          </v-stepper-content>

          <v-stepper-step
            :complete="connectStep > 2"
            step="2"
          >
            Authenticating
            <small>Establishing secure peer-to-peer connection.</small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-progress-linear
              color="info"
              indeterminate
              :size="50"
              :width="7"
            >
            </v-progress-linear>
          </v-stepper-content>

          <v-stepper-step step="3">
            Done
          </v-stepper-step>
          <v-stepper-content step="3">
          </v-stepper-content>
        </v-stepper>
      </v-col>
      <!-- <v-dialog
        v-model="resetEdgeDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title class="headline">Reset device pairing?</v-card-title>

          <v-card-text>
            <p>
            Are you switching to a new Ambianic Edge device?
            Resetting a device association is usually done when switching to
            a new edge device with a different Peer ID.
            </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text
              @click="resetEdgeDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              text
              @click="resetEdgeConnection()"
              :to="'choose-edge-connection'"
            >
              Yes, Reset
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
// import { settingsDB } from '@/store/db'
import { INITIALIZE_PNP, REMOVE_REMOTE_PEER_ID } from '../store/action-types.js'
import { mapState } from 'vuex'
import {
  PEER_DISCONNECTED,
  PEER_DISCOVERING,
  PEER_DISCOVERED,
  PEER_CONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'

export default {
  data: function () {
    return {
      // connectionStatus: '',
      // connectionTip: '',
      // testInProgress: false,
      // testDone: true,
      // statusColor: 'info',
      // resetEdgeDialog: false
    }
  },
  computed: {
    peerConnectionError: function () {
      console.log('this.$store.state.pnp.peerConnectionStatus', this.$store.state.pnp.peerConnectionStatus)
      return this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR
    },
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      // map this.edgeConnected to this.$store.state.edgeConnected
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      version: state => state.version
    }),
    connectStep: function () {
      let step = 1
      switch (this.peerConnectionStatus) {
        case PEER_DISCONNECTED:
        case PEER_CONNECTION_ERROR:
          step = 1
          break
        case PEER_DISCOVERING:
        case PEER_DISCOVERED:
        case PEER_CONNECTING:
        case PEER_AUTHENTICATING:
          step = 2
          break
        case PEER_CONNECTED:
          step = 3
          break
        default:
          break
      }
      return step
    }
  },
  components: {
    AppFrame
  },
  mounted () {
    this.loadSettings()
  },
  destroyed () {
    if (this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTED) {
      this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
      this.$store.state.pnp.remotePeerId = null
      this.$store.state.pnp.edgeRoom = undefined
    }
  },
  methods: {
    // resetEdgeConnection () {
    //   this.resetEdgeDialog = false
    //   this.removeEdgeId()
    // },
    loadSettings () {
      /**
        Begin connection attempt to Ambianic Edge as soon as the app is created
       */
      this.$store.dispatch(INITIALIZE_PNP)
    },
    saveSettings () {
      // settingsDB.set('ambanic-edge-address', this.edgeAddress)
    }
  }
}

</script>
