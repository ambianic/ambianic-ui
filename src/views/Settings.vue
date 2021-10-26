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
      >
        <v-card>
          <v-card-title
            data-cy="titlecard"
            v-if="edgePeerId"
          >
            {{ edgeDisplayName }}
          </v-card-title>
          <v-card-title
            data-cy="titlecard"
            v-else
          >
            No device selected.
          </v-card-title>
          <v-card-subtitle
            data-cy="titlecard"
            v-if="edgePeerId"
          >
            My current device
          </v-card-subtitle>
          <v-card-subtitle
            data-cy="titlecard"
            v-else
          >
            Select a device to connect to.
          </v-card-subtitle>
          <v-card-text
            v-if="edgePeerId"
          >
            <v-list
              two-line
            >
              <v-list-item>
                <v-list-item-avatar left>
                  <v-icon
                    v-if="isEdgeConnected"
                    large
                  >
                    mdi-cloud-check-outline
                  </v-icon>
                  <v-icon
                    v-else
                    large
                  >
                    mdi-cloud-off-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="isEdgeConnected">
                    Connected.
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    Not connected.
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    text
                    color="info"
                    to="devicecard"
                  >
                    <span>Details</span>
                    <v-icon>info</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <amb-list-item
                :title="edgePeerId"
                subtitle="Peer ID"
                icon-name="identifier"
                :sensitive-field="true"
                :copy-option="true"
                ref="list-item-edgePeerID"
                data-cy="list-item-edgePeerID"
              />
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn
              to="selectdevice"
            >
              <span>My Devices</span>
              <v-icon>navigate_next</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR,
  PEER_CONNECTING,
  PEER_DISCONNECTING,
  PEER_AUTHENTICATING
} from '@/store/mutation-types'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    AmbListItem: () => import('@/components/shared/ListItem.vue')
  },
  data () {
    return {
      edgeAddress: undefined,
      edgeDeviceError: null,
      syncing: false // is the UI in the process of syncing with remote device data
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      setCurrentDevice: 'myDevices/setCurrent'
    })
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
      edgeDisplayName: state => state.myDevices.currentDeviceCard ? state.myDevices.currentDeviceCard.displayName : '',
      isEdgeConnecting: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTING ||
        state.pnp.peerConnectionStatus === PEER_AUTHENTICATING,
      isEdgeDisconnecting: state =>
        state.pnp.peerConnectionStatus === PEER_DISCONNECTING
    })
  },
  watch: {
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
