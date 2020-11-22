<template>
  <v-container fluid>
    <v-row
      align="start"
      justify="center"
      class="pb-5"
      data-cy="template-row"
    >
      <v-col>
        <v-card>
          <v-card-title
            class="light grey"
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
                  progress
                  banner-class="text-left"
                  icon="wifi-off"
                  text="Connecting to Ambianic Edge device..."
                />
                <v-card
                  class="mx-auto text-left"
                >
                  <v-list
                    two-line
                  >
                    <amb-list-item
                      :title="this.ambianicEdge.edgeFriendlyName"
                      subtitle="Display Name"
                      icon-name="tag"
                    />
                    <v-divider inset />
                    <amb-list-item
                      :title="edgePeerId"
                      subtitle="Peer ID"
                      icon-name="identifier"
                      id="edgePeerID"
                    />
                    <amb-list-item
                      :title="version"
                      subtitle="Release Version"
                      icon-name="alpha-v-circle-outline"
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
                <v-card>
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
      </v-col>
      <v-col>
        <v-card>
          <v-card-title
            class="light grey"
          >
            Remote Ambianic Edge
          </v-card-title>
          <!-- Populate the v-select with the friendlynames -->
          <v-select
            :ambianic-edge="friendlyEdges"
            label="Outlined style"
            outlined
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
      class="pb-5"
    >
      <v-card>
        <v-card-title
          class="light grey"
          data-cy="localtitlecard"
        >
          Pair with local Ambianic Edge device
        </v-card-title>
        <v-container grid-list-sm>
          <!-- top column -->
          <v-card min-width="100">
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
                  @click="localEdgeAddress"
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
          class="light grey"
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
              v-model="ambianicEdge.edgeAddress"
              type="text"
              label="Peer ID of remote Ambianic Edge device*"
              placeholder="Enter Peer ID"
              id="remotePeerID"
              outlined
              dense
              class="mt-4"
              data-cy="remotePeerID"
            />
            <v-subheader>
              (Enter a friendly name)
            </v-subheader>
            <v-text-field
              v-model="edgeFriendlyNameSet"
              type="text"
              label="Friendly name to remote Edge"
              placeholder="Friendly name (Optional)"
              id="remotePeerID"
              outlined
              dense
              class="mt-4"
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
</template>
<script>
import AmbBanner from '@/components/shared/Banner.vue'
import AmbListItem from '@/components/shared/ListItem.vue'
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
  REMOVE_REMOTE_PEER_ID,
  ADD_FRIENDLY_NAME
} from '../store/action-types.js'

export default {
  components: {
    AmbBanner,
    AmbListItem
  },
  data () {
    return {
      ambianicEdge: {
        edgeAddress: undefined,
        edgeFriendlyName: 'My Home Ambianic'
      },
      correctEdgeAddress: false,
      edgeFriendlyNameSet: '',
      friendlyEdges: []
    }
  },
  mounted () {
  },
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validateIP (value) {
      if (/^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value.edgeAddress)) {
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
      this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.ambianicEdge)
      if (this.edgeFriendlyNameSet === undefined || this.edgeFriendlyNameSet === '') {
        this.ambianicEdge.edgeFriendlyName = 'No Friendly Name Set'
      } else {
        this.ambianicEdge.edgeFriendlyName = this.edgeFriendlyNameSet
      }
      this.$store.dispatch(ADD_FRIENDLY_NAME, { ...this.ambianicEdge })
    },
    localEdgeAddress () {
      this.edgeAddress = undefined
      this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
    }
  },
  computed: {
    peerConnectionError: function () {
      console.log('this.$store.state.pnp.peerConnectionStatus', this.$store.state.pnp.peerConnectionStatus)
      return this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR
    },
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      version: state => state.version,
      /* Try to fetch out the friendlyname object from the state to populate the dropdown with name and beeing able to use the PeerId to connect with */
      friendlyName: state => state.peerFriendlyName
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
  watch: {
    ambianicEdge: {
      handler (value) {
        this.edgeAddress = value
        this.validateIP(value)
      },
      deep: true
    }
  }
}

</script>
