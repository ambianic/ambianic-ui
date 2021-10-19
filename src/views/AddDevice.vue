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
                        Discover a device on the local WiFi network or connect remotely.
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          @click="chooseDiscoverLocal()"
                        >
                          Local
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          @click="addDeviceStep = 2"
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
                      <v-card-actions>
                        <v-btn
                          :disabled="selectedLocalDevice < 0"
                          @click="clickConnect"
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
                      <v-card-text>
                        Successfully added a new device. Continue to device timeline or configure settings.
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
      <v-row
        align="start"
        justify="center"
        class="pb-5"
      >
        <v-card>
          <v-card-title
            data-cy="localtitlecard"
          >
            Pair with local Ambianic Edge device
          </v-card-title>
          <v-container grid-list-sm>
            <!-- top column -->
            <v-card
              min-width="100"
              flat
            >
              <v-card-text class="text-center">
                <p class="text">
                  [On by default] Discover and pair with an Ambianic Edge device on
                  your local network. This is the default pairing mode
                  that triggers automatically when you open this app for the first time.
                  Once paired and connected, you can access the Edge device remotely
                  from any Internet access point.
                </p>
              </v-card-text>
              <v-card-actions>
                <v-row justify="center">
                  <v-btn
                    color="primary"
                    :small="$vuetify.breakpoint.mdAndUp"
                    @click="discoverLocalEdgeDevice"
                    id="btn-discoverLocal"
                    data-cy="btn-discoverLocal"
                  >
                    <v-icon v-if="$vuetify.breakpoint.xsOnly">
                      mdi-wifi
                    </v-icon>
                    <span v-if="$vuetify.breakpoint.smAndUp">
                      Discover on Local Network
                    </span>
                  </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-card>
      </v-row>
      <v-row
        align="start"
        justify="center"
        class="pb-5"
      >
        <v-card>
          <v-card-title
            data-cy="remotetitlecard"
          >
            Pair with remote Ambianic Edge device
          </v-card-title>
          <v-container grid-list-sm>
            <v-card-text>
              <p class="text">
                Use this more advanced option, if you want to pair with an Ambianic Edge device
                that you don't have physical access to
                and you are not able to join its local network for an initial
                pairing sequence. You need to request the device Peer ID
                from someone who is already connected to it. Once you obtain
                the Peer ID of the remote Ambiannic Edge device, enter it
                below and click Pair Remotely.
              </p>
              <v-subheader>
                (Enter the Peer ID of the remote Ambianic Edge device.)
              </v-subheader>
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
              />
            </v-card-text>

            <v-card-actions>
              <v-btn
                :disabled="!isPeerIdValid"
                @click="sendRemotePeerId"
                color="primary"
                id="btn-sendRemotePeerID"
                data-cy="sendRemotePeerID"
              >
                Pair Remotely
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  PEER_DISCONNECTED,
  PEER_DISCOVERING,
  PEER_DISCOVERED,
  PEER_CONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'
import {
  CHANGE_REMOTE_PEER_ID,
  PEER_DISCOVER,
  REMOVE_REMOTE_PEER_ID
} from '../store/action-types.js'

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
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
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
      if (/^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)) {
        this.isPeerIdValid = true
        return this.isPeerIdValid
      } else {
        // if value is not matching regex, remove button
        this.isPeerIdValid = false
        return this.isPeerIdValid
      }
    },
    ...mapActions([
      'CHANGE_REMOTE_PEER_ID'
    ]),
    /**
     * User clicked Connect to a selected device
     */
    async clickConnect () {
      console.debug('clickConnect() enter')
      this.addDeviceStep++
      this.edgePeerId = this.discoveredPeers[this.selectedLocalDevice]
      console.debug('User selected device:', this.selectedLocalDevice, this.edgePeerId)
      this.sendRemotePeerId()
    },
    async sendRemotePeerId () {
      await this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.edgePeerId)
    },
    /**
     * User wants local device discovery
     */
    async chooseDiscoverLocal () {
      console.debug('chooseDiscoverLocal() enter')
      this.addDeviceStep++
      this.isChoiceDiscoverLocal = true
      this.discoverLocalEdgeDevice()
    },
    async discoverLocalEdgeDevice () {
      this.edgePeerId = undefined
      console.debug('discoverLocalEdgeDevice() called')
      console.debug('removing any existing peer connection')
      await this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
      await this.$store.dispatch(PEER_DISCOVER)
      console.debug('discoverLocalEdgeDevice() ended')
    },
    /**
     * User wants local device discovery
     */
    async connectStepCompleted () {
      console.debug('connectStepCompleted() enter')
      this.addDeviceStep++
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
    }),
    connectStep: function () {
      let step = 1
      switch (this.peerConnectionStatus) {
        case PEER_DISCONNECTED:
        case PEER_DISCOVERING:
          step = 1
          break
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
  watch: {
    edgePeerId (value) {
      this.edgePeerId = value
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
