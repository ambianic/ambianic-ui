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
        align="center"
      >
        <v-dialog
          v-model="syncing"
          persistent
          max-width="300"
        >
          <v-card>
            <v-card-text
              color="accent"
            >
              Syncing with Ambianic Edge device
              <v-progress-linear
                indeterminate
              />
            </v-card-text>
          </v-card>
        </v-dialog>
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
            Ambianic Edge connection details
          </v-card-title>
          <v-card-text grid-list-sm>
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
                  icon="cloud-check-outline"
                  text="Ambianic Edge device connected!"
                />
                <amb-banner
                  v-else
                  banner-class="text-left"
                  icon="cloud-off-outline"
                  icon-color="info"
                  data-cy="edge-device-disconnected"
                  text="Ambianic Edge device disconnected."
                />
                <v-card
                  class="mx-auto text-left"
                  flat
                  v-if="isEdgeConnected"
                >
                  <v-list
                    two-line
                  >
                    <amb-list-item
                      ref="list-item-edgeDeviceName"
                      data-cy="list-item-edgeDeviceName"
                      :title="edgeDisplayName"
                      subtitle="Display Name"
                      icon-name="tag"
                      :edit-option="true"
                      :on-submit="onDisplayNameChanged"
                      :rules="[rules.required, rules.counter]"
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
                      ref="list-item-edgeVersion"
                      :title="edgeVersion"
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
                      v-if="!this.isPeerConnectionError"
                      color="info"
                      indeterminate
                      :size="50"
                      :width="7"
                    />
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
                v-model="edgeAddress"
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
                :disabled="!correctEdgeAddress"
                @click="sendEdgeAddress"
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
  PEER_CONNECTION_ERROR,
  EDGE_DEVICE_DETAILS,
  EDGE_DEVICE_DISPLAY_NAME
} from '@/store/mutation-types'
import {
  CHANGE_REMOTE_PEER_ID,
  PEER_DISCOVER,
  REMOVE_REMOTE_PEER_ID
} from '../store/action-types.js'
import AmbListItem from '@/components/shared/ListItem.vue'
import { validatePeerIdHelper } from '../components/utils'

export default {
  components: {
    AmbBanner: () => import('@/components/shared/Banner.vue'),
    AmbListItem,
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      edgeAddress: undefined,
      correctEdgeAddress: false,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      }
    }
  },
  created () {
    // if a connection to the edge device is already established
    // but version info has not been fetched yet, let's do it now
    if (this.isEdgeConnected && !this.edgeVersion) {
      this.fetchEdgeDetails()
    }
  },
  mounted () {
  },
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validateIP (value) {
      this.correctEdgeAddress = validatePeerIdHelper(value)
    },
    ...mapActions([
      'CHANGE_REMOTE_PEER_ID'
    ]),
    async sendEdgeAddress () {
      await this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.edgeAddress)
    },
    async discoverLocalEdgeDevice () {
      this.edgeAddress = undefined
      console.debug('discoverLocalEdgeDevice() called')
      console.debug('removing any existing peer connection')
      await this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
      await this.$store.dispatch(PEER_DISCOVER)
      console.debug('discoverLocalEdgeDevice() ended')
    },
    async fetchEdgeDetails () {
      try {
        const details = await this.pnp.edgeAPI.getEdgeStatus()
        console.debug('Edge device details fetched:', { details })
        if (!details || !details.version) {
          this.edgeDeviceError = 'Edge device requires update.'
        } else {
          this.$store.commit(EDGE_DEVICE_DETAILS, details)
        }
      } catch (e) {
        this.edgeDeviceError = 'Edge device API offline or unreachable.'
      }
    },
    async onDisplayNameChanged (newDisplayName) {
      console.debug(`newDisplayName: ${newDisplayName}`)
      let updated = false
      if (newDisplayName) {
        try {
          console.debug(`New device display name: ${newDisplayName}`)
          // trigger edit change callback
          //    show blocking dialog with spinner https://vuetifyjs.com/en/components/dialogs/#loader
          //    await dispatch to push new device display name: 1. to device, 2. to local device store
          this.syncing = true
          await this.pnp.edgeAPI.setDeviceDisplayName(newDisplayName)
          this.$store.commit(EDGE_DEVICE_DISPLAY_NAME, newDisplayName)
          updated = true
        } catch (e) {
          this.edgeDeviceError = 'Error updating display name on edge device. Could be offline or outdated.'
          console.error('Exception calling setDeviceDisplayName()', e, e.stack)
        } finally {
          this.syncing = false
        }
      }
      return updated
    }
  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isPeerConnectionError: state => state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      edgeVersion: state => state.edgeDevice.edgeSoftwareVersion,
      edgeDisplayName: state => {
        const deviceLabel = (state.edgeDevice.edgeDisplayName) ? state.edgeDevice.edgeDisplayName : 'My Ambianic Edge Device'
        return deviceLabel
      }
    }),
    connectStep: function () {
      let step = 1
      switch (this.peerConnectionStatus) {
        case PEER_DISCONNECTED:
        case PEER_DISCOVERING:
          step = 1
          break
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
  watch: {
    edgeAddress (value) {
      this.edgeAddress = value
      this.validateIP(value)
    },
    isEdgeConnected: async function (isConnected) {
      if (isConnected) {
        await this.fetchEdgeDetails()
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
