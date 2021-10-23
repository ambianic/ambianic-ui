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
        v-if="edgePeerId"
      >
        <v-card>
          <v-card-title
            data-cy="titlecard"
          >
            {{ edgeDisplayName }}
          </v-card-title>
          <v-card-subtitle
            data-cy="titlecard"
          >
            My current device
          </v-card-subtitle>
          <v-card-text>
            <v-list
              two-line
            >
              <amb-list-item
                :title="edgePeerId"
                subtitle="Peer ID"
                icon-name="identifier"
                :sensitive-field="true"
                :copy-option="true"
                ref="list-item-edgePeerID"
                data-cy="list-item-edgePeerID"
              />
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
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="reveal = true"
              v-if="!reveal"
            >
              <span>Select Another Device</span>
              <v-icon>alt_route</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition
            v-if="reveal"
          >
            <div>
              <my-devices />
            </div>
          </v-expand-transition>
        </v-card>
      </v-row>
      <v-row
        justify="center"
        v-else
      >
        <my-devices />
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapState } from 'vuex'
import {
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    AmbListItem: () => import('@/components/shared/ListItem.vue'),
    MyDevices: () => import('@/components/MyDevices.vue')
  },
  data () {
    return {
      reveal: false,
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
      edgeDisplayName: state => state.edgeDevice.edgeDisplayName
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
