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
        <v-card
        >
          <v-card-title
            data-cy="titlecard"
          >
            {{ edgeDisplayName }}
          </v-card-title>
          <v-card-subtitle
            data-cy="titlecard"
          >
            Your current device selection
          </v-card-subtitle>
          <v-card-text>
            <v-list-item
            >
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
              <v-list-item-content
              >
                <v-list-item-title v-if="isEdgeConnected">Connected.</v-list-item-title>
                <v-list-item-title v-else>Not connected.</v-list-item-title>
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
          <v-expand-transition>
            <v-card
              v-if="reveal"
              class="transition-fast-in-fast-out v-card--reveal"
              style="height: 100%;"
            >
              <v-card-text
                class="pb-0 dottedBorder"
                color="warning"
                v-if="!moreDevices"
              >
                <p>No other devices added.</p>
              </v-card-text>
              <v-card-text
                class="pb-0"
                v-else
              >
                <p class="text-h4 text--primary">
                  Your Devices:
                </p>
                <p>...</p>
              </v-card-text>
              <v-card-text style="height: 100px; position: relative">
                <v-fab-transition>
                  <v-btn
                    color="accent"
                    absolute
                    bottom
                    right
                    large
                    fab
                    @click="addDeviceDialog = true"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-fab-transition>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn
                  text
                  @click="reveal = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
        <v-dialog
          v-model="addDeviceDialog"
          max-width="344"
        >
          <v-card>
            <v-card-title>
              Add Device
            </v-card-title>

            <v-card-text>
              Proceed to adding a new device connection?
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn
                to="adddevice"
              >
                Continue
              </v-btn>
              <v-spacer />
              <v-btn
                @click="addDeviceDialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row
        justify="center"
        v-else
      >
        <v-card
          width="344"
        >
          <v-card-title
            data-cy="titlecard"
          >
            No Ambianic Edge devices added
          </v-card-title>
          <v-card-text>
            Add and manage one or more Ambianic Edge devices.
          </v-card-text>
          <v-card-actions>
            <v-btn
              to="adddevice"
            >
              Add Device
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
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'
import {
  CHANGE_REMOTE_PEER_ID
} from '../store/action-types.js'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      reveal: false,
      edgeAddress: undefined,
      correctEdgeAddress: false,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      },
      moreDevices: undefined,
      addDeviceDialog: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'CHANGE_REMOTE_PEER_ID'
    ]),
    async selectAnotherEdgeDevice () {
      await this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.edgeAddress)
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

<style>
.dottedBorder {border-style: dashed; opacity: 0.5  }
</style>
