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
        <v-banner two-line>
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
          v-model="e6"
          vertical
        >
          <v-stepper-step
            :complete="e6 > 1"
            step="1"
          >
            Discover
            <small>Looking for your Ambianic Edge device</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="15"
              :value="discoveryProgressValue"
              color="teal"
            >
              {{ discoveryProgressValue }}
            </v-progress-circular>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 2"
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
              @click="e6 = 3"
            >
              Continue
            </v-btn>
            <v-btn text>
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="e6 > 3"
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
              @click="e6 = 4"
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
              @click="e6 = 1"
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
import { settingsDB } from '@/store/db'
import { testConnection, EdgeConnectionStatus } from '@/remote/edgeAPI'
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      edgeAddress: '',
      connectionStatus: '',
      connectionTip: '',
      testInProgress: false,
      testDone: true,
      statusColor: 'info',
      e6: 0,
      discoveryProgressValue: 0
    }
  },
  computed: {
    ...mapState([
      // map this.edgeConnected to this.$store.state.edgeConnected
      'isEdgeConnected'
    ])
  },
  components: {
    AppFrame
  },
  mounted () {
    this.loadSettings()
    this.interval = setInterval(() => {
      if (this.discoveryProgressValue === 100) {
        return (this.discoveryProgressValue = 0)
      }
      this.discoveryProgressValue += 10
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    loadSettings () {
      settingsDB.get('ambanic-edge-address').then(
        (address) => {
          this.edgeAddress = address
        }
      )
    },
    saveSettings () {
      settingsDB.set('ambanic-edge-address', this.edgeAddress)
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
