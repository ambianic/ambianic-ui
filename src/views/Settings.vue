<template>
  <v-row
    align="start"
    justify="space-around"
  >
    <v-card>
      <v-card-title class="grey darken-2">
        Settings
      </v-card-title>
      <v-container grid-list-sm>
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            align-center
            justify-space-between
          >
            <v-layout align-center>
              <v-text-field
                prepend-icon="mdi-web"
                placeholder="Ambianic Edge Device IP Address (e.g. 192.168.68.31) or host name (e.g. ambianic-edge.lan)"
                v-model="settingsForm.address"
              />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          @click="test"
        >
          Test Connection
        </v-btn>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
      <v-container
        v-if="testInProgress"
      >
        <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="subtitle-1 text-center"
            cols="12"
          >
            Testing your connection
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="info accent-4"
              indeterminate
              rounded
              height="6"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-container
        v-if="testDone"
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            align-center
            justify-center
          >
            <v-layout
              align-center
              justify-center
            >
              <v-chip
                class="ma-2"
                :color="statusColor"
                outlined
                align-center
                justify-center
              >
                <v-icon left>
                  mdi-server-plus
                </v-icon>
                Connection Status: {{ connectionStatus }}
              </v-chip>
            </v-layout>
          </v-flex>
          <v-flex
            xs12
            align-center
            justify-center
          >
            <v-layout
              align-center
              justify-center
            >
              <v-icon left>
                mdi-lightbulb
              </v-icon>
              <span>{{ connectionTip }}</span>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-row>
</template>
<script>
import { settingsDB } from '@/store/db'
import { testConnection, EdgeConnectionStatus } from '@/remote/edgeAPI'
export default {
  data () {
    return {
      settingsForm: {
        address: ''
      },
      connectionStatus: '',
      connectionTip: '',
      testInProgress: false,
      testDone: false,
      statusColor: 'info'
    }
  },
  mounted () {
    this.loadSettings()
  },
  methods: {
    loadSettings () {
      settingsDB.get('ambanic-edge-address').then(
        (address) => {
          this.settingsForm.address = address
        }
      )
    },
    saveSettings () {
      settingsDB.set('ambanic-edge-address', this.settingsForm.address)
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
