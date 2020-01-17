<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
      <v-col
        v-if="!isEdgeConnected"
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
            color="warning"
            size="36"
          >
            mdi-wifi-strength-alert-outline
          </v-icon>
          Let's connect to your Ambianic Edge device.
          Make sure its running and has Internet access.
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
            >
            </v-progress-linear>
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
            Authenticate
            <small>Establish secure direct connection</small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            />
            <v-btn
              color="primary"
              @click="connectStep = 3"
            >
              Continue
            </v-btn>
            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="connectStep > 3"
            step="3"
          >
            Test
            <small>Check connection quality</small>
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            />
            <v-btn
              color="primary"
              @click="connectStep = 4"
            >
              Continue
            </v-btn>
            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">
            Done
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card
              color="grey lighten-1"
              class="mb-12"
              height="200px"
            />
            <v-btn
              color="primary"
              @click="connectStep = 1"
            >
              Continue
            </v-btn>
            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
// import { settingsDB } from '@/store/db'
import { testConnection, EdgeConnectionStatus } from '@/remote/edgeAPI'
import { mapState } from 'vuex'
import {
  PEER_DISCONNECTED,
  PEER_CONNECTING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types.js'

export default {
  data: function () {
    return {
      // edgeAddress: '',
      connectionStatus: '',
      connectionTip: '',
      testInProgress: false,
      testDone: true,
      statusColor: 'info'
    }
  },
  computed: {
    peerConnectionError: function () {
      console.log('this.$store.state.pnp.peerConnectionStatus', this.$store.state.pnp.peerConnectionStatus)
      return this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR
    },
    connectStep: function () {
      let step = 0
      switch (this.$store.state.pnp.peerConnectionStatus) {
        case PEER_DISCONNECTED:
        case PEER_CONNECTION_ERROR:
          step = 0
          break
        case PEER_CONNECTING:
          step = 1
          break
        case PEER_CONNECTED:
          step = 2
          break
        default:
          break
      }
      return step
    },
    ...mapState([
      'peerConnectionStatus',
      // map this.edgeConnected to this.$store.state.edgeConnected
      'isEdgeConnected'
    ])
  },
  components: {
    AppFrame
  },
  mounted () {
    this.loadSettings()
  },
  beforeDestroy () {
  },
  methods: {
    loadSettings () {
      // settingsDB.get('ambanic-edge-address').then(
      //   (address) => {
      //     this.edgeAddress = address
      //   }
      // )
    },
    saveSettings () {
      // settingsDB.set('ambanic-edge-address', this.edgeAddress)
    },
    cancel () {
      this.testInProgress = false
      this.testDone = false
      // load previously saved settings
      this.loadSettings()
    },
    save () {
      this.testInProgress = false
      this.testDone = false
      // store settings
      this.saveSettings()
    },
    test () {
      this.testInProgress = true
      this.testDone = false
      testConnection(this.settingsForm.address).then(
        status => {
          if (!this.testInProgress) return // test cancelled
          switch (status) {
            case EdgeConnectionStatus.OFFLINE:
              this.connectionStatus = 'OFFLINE'
              this.connectionTip = 'No connection to edge device.'
              this.statusColor = 'error'
              break
            case EdgeConnectionStatus.UNAVAILABLE:
              this.connectionStatus = 'OFFLINE'
              this.connectionTip = 'Edge device is not responsive.'
              this.statusColor = 'error'
              break
            case EdgeConnectionStatus.OK:
              this.connectionStatus = 'OK'
              this.connectionTip = 'Edge device API available.'
              this.statusColor = 'success'
              break
          }
          this.testInProgress = false
          this.testDone = true
          // console.debug(`Ambianic Edge device connection status ${status}`)
        }
      )
    }
  }
}

</script>
