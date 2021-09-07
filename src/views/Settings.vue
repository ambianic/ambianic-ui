<template>
  <amb-app-frame>
    <v-container fluid>
      <v-row
        align="start"
        justify="center"
        class="pb-5"
        data-cy="template-row"
      >
        <v-card flat>
          <v-card-title
            data-cy="titlecard"
          >
            Ambianic Edge connection details
          </v-card-title>
          <v-container grid-list-sm>
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
                <amb-banner
                  v-if="isEdgeConnected"
                  banner-class="text-left"
                  icon="wifi"
                  text="Ambianic Edge device connected!"
                />
                <amb-banner
                  v-else
                  :progress="peerConnectionStatus !== 'PEER_DISCONNECTED'"
                  banner-class="text-left"
                  :icon="connectionStatusIcon"
                  icon-color="info"
                  id="connection-status-element"
                  :text="connectionStatusText"
                />
                <v-card
                  class="mx-auto text-left"
                  flat
                >
                  <v-list
                    two-line
                  >
                    <amb-list-item
                      ref="list-item-edgeDeviceName"
                      title="My Ambianic Edge Device"
                      subtitle="Display Name"
                      icon-name="tag"
                    />
                    <v-divider inset />
                    <amb-list-item
                      :title="edgePeerId"
                      subtitle="Peer ID"
                      icon-name="identifier"
                      :sensitive-field="true"
                      :copy-option="true"
                      ref="list-item-edgePeerID"
                      data-cy="list-item-edgePeerID"
                    />
                    <amb-list-item
                      ref="list-item-releaseVersion"
                      v-if="peerConnectionStatus === 'PEER_CONNECTED'"
                      :title="edgeVersion"
                      :error="edgeDeviceError"
                      id="version-element"
                      subtitle="Edge Software Version"
                      icon-name="alpha-v-circle-outline"
                      data-cy="list-item-edgeVersion"
                    />
                  </v-list>
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
                <amb-banner
                  banner-class="text-left"
                  icon="wifi-off"
                  icon-color="info"
                  text="Let's find your Ambianic Edge device and connect to it..."
                />
                <v-stepper
                  v-model="connectionStep"
                  vertical
                >
                  <v-stepper-step
                    :complete="connectionStep > 1"
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
                    :complete="connectionStep > 2"
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
                    />
                  </v-stepper-content>
                  <v-stepper-step step="3">
                    Done
                  </v-stepper-step>
                  <v-stepper-content step="3" />
                </v-stepper>
              </v-col>
              <v-dialog
                max-width="500"
              >
                <v-card flat>
                  <v-card-title class="headline">
                    Reset device pairing?
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Are you switching to a new Ambianic Edge device?
                      Resetting a device association is usually done when switching to
                      a new edge device with a different Peer ID.
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                    >
                      Yes, Reset
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
      <v-row
        align="start"
        justify="center"
        class="pb-5"
      >
        <v-card style="padding: 1rem">
          <v-card-title
            data-cy="localtitlecard"
          >
            Pair with local Ambianic Edge device
          </v-card-title>
          <v-container grid-list-sm>
            <v-expansion-panels
              accordion
              v-if="!$vuetify.breakpoint.smAndUp"
            >
              <v-expansion-panel>
                <v-expansion-panel-header>Discover Device Info</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p class="text">
                    {{ discoverText }}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- top column -->
            <v-card
              min-width="100"
              flat
            >
              <v-card-text class="text-center">
                <p
                  v-if="$vuetify.breakpoint.smAndUp"
                  class="text"
                >
                  {{ discoverText }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-row justify="center">
                  <v-btn
                    color="primary"
                    :small="$vuetify.breakpoint.mdAndUp"
                    @click="localEdgeAddress"
                    id="btn-discoverLocal"
                  >
                    <v-icon v-if="$vuetify.breakpoint.xsOnly">
                      mdi-wifi
                      <p class="text">
                        Use this more advanced option, if you want to pair with an Ambianic Edge device
                        that you don't have physical access to
                        and you are not able to join its local network for an initial
                        pairing sequence. You need to request the device Peer ID
                        from someone who is already connected to it. Once you obtain
                        the Peer ID of the remote Ambiannic Edge device, enter it
                        below and click Pair Remotely.
                      </p>
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
                v-model="manualEdgeAddress"
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
                :disabled="!correctEdgeAddress || isReParing"
                @click="sendEdgeAddress"
                color="primary"
                id="btn-sendRemotePeerID"
                data-cy="sendRemotePeerID"
              >
                {{ !isReParing ? "Pair" : "Pairing" }} Remotely

                <v-progress-circular
                  v-if="isReParing"
                  style="margin-left: 7px"
                  width="2"
                  size="23"
                  color="info"
                  indeterminate
                />
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
  PEER_CONNECTION_ERROR,
  EDGE_DEVICE_DETAILS
} from '@/store/mutation-types'
import {
  CHANGE_REMOTE_PEER_ID,
  REMOVE_REMOTE_PEER_ID
} from '../store/action-types.js'
import AmbListItem from '@/components/shared/ListItem.vue'
import { EdgeAPI } from '@/remote/edgeAPI'
import { PEER_CONNECTING_NOTIFICATION, PEER_DISCONNECTED_NOTIFICATION } from '../components/utils'

export default {
  components: {
    AmbBanner: () => import('@/components/shared/Banner.vue'),
    AmbListItem,
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      isReParing: false,
      discoverText: '[On by default] Discover and pair with an Ambianic Edge device on\n' +
          '                  your local network. This is the default pairing mode\n' +
          '                  that triggers automatically when you open this app for the first time.\n' +
          '                  Once paired and connected, you can access the Edge device remotely\n' +
          '                  from any Internet access point.',
      isTrue: false,
      manualEdgeAddress: undefined,
      correctEdgeAddress: false,
      edgeDeviceError: null,
      connectionStep: 1,
      connectionStatusText: PEER_CONNECTING_NOTIFICATION,
      connectionStatusIcon: 'cloud-sync-outline'
    }
  },
  created () {
    this.edgeAPI = new EdgeAPI(this.pnp)
    // if a connection to the edge device is already established
    // but version info has not been fetched yet, let's do it now
    if (this.isEdgeConnected && !this.edgeVersion) {
      this.fetchEdgeDetails()
    }

    this.handleConnectionStep(this.peerConnectionStatus)
  },
  mounted () {
  },
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validateIP (value) {
      if (/^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)) {
        this.correctEdgeAddress = true
        return this.correctEdgeAddress
      } else {
        // if value is not matching regex, remove button
        this.correctEdgeAddress = false
        return this.correctEdgeAddress
      }
    },
    ...mapActions([
      'CHANGE_REMOTE_PEER_ID'
    ]),
    sendEdgeAddress () {
      // begins (re)paring remotely
      this.isReParing = false
      this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.manualEdgeAddress)
    },
    localEdgeAddress () {
      this.manualEdgeAddress = undefined
      this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
    },
    async fetchEdgeDetails () {
      try {
        const details = await this.edgeAPI.getEdgeStatus()

        if (!details.version) {
          this.edgeDeviceError = 'Unavailable. Outdated device?'
        }
        await this.$store.commit(EDGE_DEVICE_DETAILS, details)
      } catch (e) {
        this.edgeDeviceError = 'Unavailable. Outdated device?'
      }
    },
    handleConnectionStep (status) {
      switch (status) {
        case PEER_DISCONNECTED:
          this.connectionStatusIcon = 'cloud-off-outline'
          this.connectionStatusText = PEER_DISCONNECTED_NOTIFICATION
          break
        case PEER_CONNECTION_ERROR:
          this.connectionStep = 1
          break
        case PEER_DISCOVERING:
        case PEER_DISCOVERED:
        case PEER_CONNECTING:
          this.isReParing = false
          this.connectionStatusIcon = 'cloud-sync-outline'
          this.connectionStatusText = PEER_CONNECTING_NOTIFICATION
          break
        case PEER_AUTHENTICATING:
          this.connectionStep = 2
          break
        case PEER_CONNECTED:
          this.connectionStep = 3
          break
        default:
          break
      }
    }
  },
  computed: {
    isPeerConnectionError: function () {
      console.log('this.$store.state.pnp.peerConnectionStatus', this.$store.state.pnp.peerConnectionStatus)
      return this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR
    },
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      edgeVersion: state => state.edgeDevice.edgeSoftwareVersion
    })
  },
  watch: {
    manualEdgeAddress (value) {
      this.manualEdgeAddress = value
      this.validateIP(value)
    },
    isEdgeConnected: async function (isConnected) {
      if (isConnected) {
        await this.fetchEdgeDetails()
      }
    },
    peerConnectionStatus: function () {
      this.handleConnectionStep(this.peerConnectionStatus)
    }
  }
}
</script>
