<template>
  <amb-app-frame>
    <v-container
      fluid
    >
      <v-row
        align="center"
      >
        <v-col cols="12">
          <v-alert
            v-if="this.edgeDeviceError"
            outlined
            type="warning"
            dense
            align-self="center"
            class="text-center"
            transition="scale-transition"
            dismissible
            data-cy="edge-device-error"
            ref="edge-device-error"
          >
            {{ this.edgeDeviceError }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row
        justify="center"
        class="pb-5"
        align="center"
      >
        <v-card flat>
          <v-card-title
            data-cy="titlecard"
          >
            Add Ambianic Edge device
          </v-card-title>
          <v-card-text grid-list-sm>
            <v-row
              align="start"
              justify="space-around"
            >
              <v-col
                style="max-width: 420px;"
                align="center"
                justify="center"
                cols="12"
                class="pa-0 ma-0 fill-height"
              >
                <v-stepper
                  v-model="addDeviceStep"
                  vertical
                >
                  <v-stepper-step
                    :complete="addDeviceStep > 1"
                    step="1"
                    :rules="[() => true]"
                  >
                    Choose connection method
                  </v-stepper-step>
                  <v-stepper-content step="1">
                    <v-card>
                      <v-card-text>
                        <p class="text-left">
                          Discover a device on the local WiFi network or connect remotely.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          @click="chooseDiscoverLocal"
                        >
                          Local
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          @click="chooseRemoteConnection"
                        >
                          Remote
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
                  <v-stepper-step
                    :complete="addDeviceStep > 2"
                    step="2"
                  >
                    Identify Device
                  </v-stepper-step>
                  <v-stepper-content step="2">
                    <v-card
                      v-if="isChoiceDiscoverLocal"
                    >
                      <v-card-text>
                        <v-list
                          v-if="isPeerDiscovered"
                        >
                          <v-subheader>Local Devices</v-subheader>
                          <v-list-item-group
                            color="primary"
                            v-model="selectedLocalDevice"
                            mandatory
                          >
                            <v-list-item
                              v-for="(item, i) in discoveredPeers"
                              :key="i"
                            >
                              <v-list-item-icon>
                                <v-icon>mdi-identifier</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title v-text="item" />
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <v-skeleton-loader
                          v-else
                          type="list-item-avatar"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          :disabled="selectedLocalDevice < 0"
                          @click="clickConnectToDiscoveredDevice"
                        >
                          Connect
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                    <v-card
                      v-else
                    >
                      <v-card-title>
                        Remote device ID
                      </v-card-title>
                      <v-card-text>
                        <p class="text-left">
                          Enter the Peer ID of the remote Ambianic Edge device.
                        </p>
                        <v-text-field
                          v-model="edgePeerId"
                          type="text"
                          label="Peer ID of remote Ambianic Edge device*"
                          placeholder="Enter Peer ID"
                          id="remotePeerID"
                          outlined
                          dense
                          class="mt-4"
                          data-cy="remotePeerID"
                          :rules="[rules.required, rules.validPeerID]"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          @click="clickConnectToRemoteDevice"
                          :disabled="!isPeerIdValid"
                        >
                          Connect
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
                  <v-stepper-step
                    :complete="addDeviceStep > 3"
                    step="3"
                    :rules="[() => true]"
                  >
                    Connect
                    <small>Establishing connection with Ambianic Edge device...</small>
                  </v-stepper-step>
                  <v-stepper-content step="3">
                    <v-progress-linear
                      v-if="!this.isPeerConnectionError"
                      color="info"
                      indeterminate
                      :size="50"
                      :width="7"
                    />
                  </v-stepper-content>
                  <v-stepper-step step="4">
                    Done
                  </v-stepper-step>
                  <v-stepper-content step="4">
                    <v-card>
                      <v-card-title>
                        <v-icon
                          x-large
                          left
                          color="green"
                        >
                          playlist_add_check_circle
                        </v-icon>
                        <span>Success!</span>
                      </v-card-title>
                      <v-card-text>
                        <p class="text-left">
                          Device successfully added to your list of managed devices.
                          Continue to device timeline or configure settings.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          to="timeline"
                        >
                          Timeline
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          to="devicecard"
                        >
                          Settings
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
                </v-stepper>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { EdgeDeviceCard } from '@/store/localdb'
import {
  PEER_DISCOVERED,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'
import {
  CHANGE_REMOTE_PEER_ID,
  PEER_DISCOVER
} from '@/store/action-types.js'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      edgePeerId: undefined,
      isPeerIdValid: false,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        validPeerID: value => this.validatePeerID(value) || 'Must be a valid peer ID.'
      },
      addDeviceStep: 1, // the sequential step number in the add device stepper flow
      isChoiceDiscoverLocal: false, // user chooses to discover a local device vs remote connection
      selectedLocalDevice: -1 // device number picked by the user from a list of discovered local devices
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validatePeerID (value) {
      if (value && /^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)) {
        this.isPeerIdValid = true
      } else {
        // if value is not matching regex, hide Connect button
        this.isPeerIdValid = false
      }
      console.debug('isPeerIdValid (value)', { value }, this.isPeerIdValid)
      return this.isPeerIdValid
    },
    ...mapActions({
      switchEdgeDeviceConnection: CHANGE_REMOTE_PEER_ID,
      addDeviceCard: 'myDevices/add',
      setCurrentDevice: 'edgeDevice/setCurrent',
      saveDeviceDetails: 'edgeDevice/saveDetails'
    }),
    /**
     * User clicked Connect to a discovered local device
     */
    async clickConnectToDiscoveredDevice () {
      console.debug('clickConnectToDiscoveredDevice() called')
      this.addDeviceStep++
      this.edgePeerId = this.discoveredPeers[this.selectedLocalDevice]
      console.debug('User selected device:', this.selectedLocalDevice, this.edgePeerId)
      await this.deviceConnect()
    },
    /**
     * User clicked Connect to a remote device
     */
    async clickConnectToRemoteDevice () {
      console.debug('clickConnectToRemoteDevice() called')
      this.addDeviceStep++
      console.debug('User requested remote connection to device ID:', this.edgePeerId)
      await this.deviceConnect()
    },
    async deviceConnect () {
      await this.switchEdgeDeviceConnection(this.edgePeerId)
    },
    /**
     * User wants local device discovery
     */
    async chooseDiscoverLocal () {
      console.debug('chooseDiscoverLocal() called')
      this.addDeviceStep++
      this.isChoiceDiscoverLocal = true
      this.discoverLocalEdgeDevice()
    },
    async discoverLocalEdgeDevice () {
      this.edgePeerId = undefined
      console.debug('discoverLocalEdgeDevice() called')
      console.debug('removing any existing peer connection')
      await this.$store.dispatch(PEER_DISCOVER)
      console.debug('discoverLocalEdgeDevice() ended')
    },
    /**
     * User wants to connect to a remote device
     */
    async chooseRemoteConnection () {
      console.debug('chooseDiscoverLocal() called')
      this.addDeviceStep++
      this.isChoiceDiscoverLocal = false
    },
    /**
     * Connection step completed.
     */
    async connectStepCompleted () {
      console.debug('connectStepCompleted() called')
      // fetch device info
      const deviceDetails = await this.fetchEdgeDetails()
      const newCard = new EdgeDeviceCard()
      newCard.peerID = this.edgePeerId
      newCard.displayName = deviceDetails.display_name
      newCard.version = deviceDetails.version
      // add to list of known devices
      console.debug('Adding new device card to localdb', { newCard })
      await this.addDeviceCard(newCard)
      console.debug('Added new device card to localdb', { newCard })
      // switch current device reference in UI state (vuex store)
      await this.setCurrentDevice(this.edgePeerId)
      this.addDeviceStep++
    },
    async fetchEdgeDetails () {
      try {
        const details = await this.pnp.edgeAPI.getEdgeStatus()
        console.debug('Edge device details fetched:', { details })
        if (!details || !details.version) {
          this.edgeDeviceError = 'Edge device requires update.'
        } else {
          this.saveDeviceDetails(details)
        }
        return details
      } catch (e) {
        this.edgeDeviceError = 'Edge device API offline or unreachable.'
      }
    }
  },
  computed: {
    ...mapState({
      discoveryStatus: state => state.pnp.discoveryStatus,
      isPeerDiscovered: state => state.pnp.discoveryStatus === PEER_DISCOVERED,
      discoveredPeers: state => state.pnp.discoveredPeers,
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isPeerConnectionError: state => state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp
    })
  },
  watch: {
    edgePeerId (value) {
      // this.edgePeerId = value
      this.validatePeerID(value)
    },
    isEdgeConnected: async function (isConnected) {
      if (isConnected) {
        await this.connectStepCompleted()
      }
    },
    isPeerConnectionError: async function (isError) {
      console.debug('watch peerConnectionError triggered. New value', { isError })
      if (isError) {
        this.edgeDeviceError = this.$store.state.pnp.userMessage
        console.debug('isPeerConnectionError TRUE. Error message:', this.edgeDeviceError)
      } else {
        // clear the user friendly error message
        this.edgeDeviceError = undefined
        console.debug('isPeerConnectionError FALSE. Error message:', this.edgeDeviceError)
      }
    }
  }
}
</script>
