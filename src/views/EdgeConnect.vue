<template>
  <v-row
    align="start"
    justify="space-around"
  >
    <v-col
      v-if="edgePeerId"
      style="max-width: 400px;"
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
            title="My Ambianic Edge Device"
            subtitle="Display Name"
            icon-name="tag"
          />

          <v-divider inset />

          <amb-list-item
            :title="edgePeerId"
            subtitle="Peer ID"
            icon-name="identifier"
          />

          <amb-list-item
            :title="version"
            subtitle="Release Version"
            icon-name="alpha-v-circle-outline"
          />
        </v-list>
        <v-btn
          text
          :to="'timeline'"
        >
          OK
        </v-btn>
        <v-btn
          text
          @click.stop="resetEdgeDialog = true"
        >
          Reset
        </v-btn>
      </v-card>
    </v-col>
    <v-col
      v-else
      style="max-width: 400px;"
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
      v-model="resetEdgeDialog"
      max-width="400"
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
            @click="resetEdgeDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            text
            @click="resetEdgeConnection()"
          >
            Yes, Reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import AmbBanner from '../components/shared/Banner.vue'
import AmbListItem from '@/components/shared/ListItem.vue'

// import { settingsDB } from '@/store/db'
import { mapState, mapActions } from 'vuex'
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
  name: 'EdgeConnect',
  components: {
    AmbBanner,
    AmbListItem
  },
  data: function () {
    return {
      // edgeAddress: '',
      connectionStatus: '',
      connectionTip: '',
      testInProgress: false,
      testDone: true,
      statusColor: 'info',
      resetEdgeDialog: false
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
  methods: {
    resetEdgeConnection () {
      this.resetEdgeDialog = false
      this.removeEdgeId()
    },
    ...mapActions({
      removeEdgeId: 'removeRemotePeerId' // map `this.removeEdgeId()` to `this.$store.dispatch('removeRemotePeerId')`
    })
  }
}

</script>
