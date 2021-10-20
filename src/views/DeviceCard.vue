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
        v-if="edgePeerId"
      >
        <v-card>
          <v-card-title
            data-cy="titlecard"
          >
            Device card
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
                  text="Device disconnected."
                />
                <v-card
                  class="mx-auto text-left"
                  flat
                >
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
                    <amb-list-item
                      ref="list-item-edgeDeviceName"
                      data-cy="list-item-edgeDeviceName"
                      :title="edgeDisplayName"
                      subtitle="Friendly Name"
                      icon-name="tag"
                      :edit-option="true"
                      :on-submit="onDisplayNameChanged"
                      :rules="[rules.required, rules.counter]"
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
            </v-row>
          </v-card-text>
          <v-card-actions
            v-if="!isEdgeConnected"
          >
            <v-btn
              @click="connectToEdgeDevice()"
              :disabled="isEdgeConnecting"
            >
              Connect
            </v-btn>
          </v-card-actions>
          <v-card-actions
            v-else
          >
            <v-btn
              text
              to="timeline"
            >
              Timeline
            </v-btn>
            <v-spacer />
            <v-btn
              @click="forgetDeviceDialog = true"
              :disabled="isEdgeDisconnecting"
              text
              color="warning"
            >
              Forget This Device
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog
          v-model="forgetDeviceDialog"
          width="344"
        >
          <v-card>
            <v-card-title>
              Forget Device
            </v-card-title>

            <v-card-text>
              Are you sure you want to forget this device?
              It will no longer show in the list of managed devices.
              However you can still add it back later.
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn
                @click="forgetEdgeDevice()"
              >
                Forget Device
              </v-btn>
              <v-spacer />
              <v-btn
                @click="forgetDeviceDialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row
        justify="center"
        class="pb-5"
        align="center"
        v-else
      >
        <v-card>
          <v-card-title
            data-cy="titlecard"
          >
            No Ambianic Edge device selected
          </v-card-title>
          <v-card-text grid-list-sm>
            Go to device management to see all your devices and add new ones.
          </v-card-text>
          <v-card-actions>
            <v-btn
              to="settings"
            >
              Manage Devices
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapState } from 'vuex'
import {
  PEER_CONNECTED,
  PEER_CONNECTING,
  PEER_DISCONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTION_ERROR,
  EDGE_DEVICE_DETAILS,
  EDGE_DEVICE_DISPLAY_NAME
} from '@/store/mutation-types'
import { PEER_CONNECT, REMOVE_REMOTE_PEER_ID } from '../store/action-types'

export default {
  components: {
    AmbBanner: () => import('@/components/shared/Banner.vue'),
    AmbListItem: () => import('@/components/shared/ListItem.vue'),
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      edgeAddress: undefined,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      },
      forgetDeviceDialog: false
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
          this.edgeDeviceError = 'Error updating display name. Edge device offline or has outdated API.'
          console.error('Exception calling setDeviceDisplayName()', { e })
        } finally {
          this.syncing = false
        }
      }
      return updated
    },
    async connectToEdgeDevice () {
      await this.$store.dispatch(PEER_CONNECT, this.edgePeerId)
    },
    async forgetEdgeDevice () {
      await this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
      // close forget device dialog
      this.forgetDeviceDialog = false
      this.$router.push({ name: 'settings' })
    }

  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isPeerConnectionError: state => state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      isEdgeConnecting: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTING ||
        state.pnp.peerConnectionStatus === PEER_AUTHENTICATING,
      isEdgeDisconnecting: state =>
        state.pnp.peerConnectionStatus === PEER_DISCONNECTING,
      pnp: state => state.pnp,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      edgeVersion: state => state.edgeDevice.edgeSoftwareVersion,
      edgeDisplayName: state => {
        const deviceLabel = (state.edgeDevice.edgeDisplayName) ? state.edgeDevice.edgeDisplayName : ''
        return deviceLabel
      }
    })
  },
  watch: {
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
