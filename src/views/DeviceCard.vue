<template>
  <amb-app-frame>
    <v-container
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col>
          <v-breadcrumbs :items="breadcrumbs" />
        </v-col>
      </v-row>
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
        v-if="edgePeerId"
      >
        <v-card
          :loading="isSyncing || isEdgeConnecting || isEdgeDisconnecting"
        >
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
                  text="Device connected!"
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
                      ref="list-item-edgeDeviceName"
                      data-cy="list-item-edgeDeviceName"
                      :title="edgeDisplayName"
                      subtitle="Friendly Name"
                      icon-name="tag"
                      :edit-option="isEdgeConnected"
                      :on-submit="onDisplayNameChanged"
                      :rules="[rules.required, rules.counter]"
                    />
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
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="connectToEdgeDevice"
              :disabled="isEdgeConnecting"
              v-if="!isEdgeConnected"
            >
              Connect
            </v-btn>
            <v-btn
              to="timeline"
              v-else
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
        >
          <v-card>
            <v-card-title>
              Forget Device?
            </v-card-title>

            <v-card-text>
              Are you sure you want to forget this device?
              It will no longer show in the list of managed devices.
              However you can still add it back later.
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn
                @click="forgetDeviceDialog = false"
              >
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                @click="forgetEdgeDevice"
                color="warning"
              >
                Forget Device
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
import { mapActions, mapState } from 'vuex'
import {
  PEER_CONNECTED,
  PEER_CONNECTING,
  PEER_DISCONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTION_ERROR
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
      isSyncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      },
      forgetDeviceDialog: false,
      breadcrumbs: [
        {
          text: 'Settings',
          disabled: false,
          href: 'settings'
        },
        {
          text: 'Device Card',
          disabled: true,
          href: 'devicecard'
        }
      ]
    }
  },
  created () {
  },
  async mounted () {
    // If a connection to the edge device is already established
    // let's pull the latest info from it in case there are changes
    // this UI client does not know about yet.
    if (this.isEdgeConnected) {
      await this.fetchEdgeDetails()
    }
  },
  methods: {
    ...mapActions({
      deleteCurrentDeviceConnection: REMOVE_REMOTE_PEER_ID,
      forgetDeviceCard: 'myDevices/forget',
      updateDisplayName: 'myDevices/updateDisplayName',
      updateFromRemote: 'myDevices/updateFromRemote',
      setCurrentDevice: 'myDevices/setCurrent'
    }),
    async fetchEdgeDetails () {
      try {
        const details = await this.pnp.edgeAPI.getEdgeStatus()
        console.debug('Edge device details fetched:', { details })
        if (!details || !details.version) {
          this.edgeDeviceError = 'This edge device is running an outdated API.'
        } else {
          // save device details in local db
          await this.updateFromRemote(details)
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
          this.isSyncing = true
          // send changes to remote edge device
          await this.pnp.edgeAPI.setDeviceDisplayName(newDisplayName)
          // save changes to localdb
          await this.updateDisplayName({ peerID: this.edgePeerId, displayName: newDisplayName })
          updated = true
        } catch (e) {
          this.edgeDeviceError = 'Error updating display name. Edge device offline or has outdated API.'
          console.error('Exception calling updateDisplayName()', { e })
        } finally {
          this.isSyncing = false
        }
      }
      return updated
    },
    async connectToEdgeDevice () {
      await this.$store.dispatch(PEER_CONNECT, this.edgePeerId)
    },
    async forgetEdgeDevice () {
      // remove from local db and vuex state
      console.debug('forgetDeviceCard', this.edgePeerId)
      await this.forgetDeviceCard(this.edgePeerId)
      // delete peer connection to curren device
      await this.deleteCurrentDeviceConnection()
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
      edgeVersion: state => state.myDevices.currentDeviceCard ? state.myDevices.currentDeviceCard.version : '',
      edgeDisplayName: state => state.myDevices.currentDeviceCard ? state.myDevices.currentDeviceCard.displayName : ''
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
