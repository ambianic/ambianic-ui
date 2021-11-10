<template>
  <amb-app-frame>
    <v-container>
      <v-row
        dense
      >
        <v-col class="ma-0 pa-0">
          <v-breadcrumbs :items="breadcrumbs" />
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="12"
          class="ma-0 pa-0"
        >
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
        v-if="isEdgeConnected"
      >
        <v-card
          :loading="isLoading"
          :disabled="isLoading"
        >
          <v-card-text grid-list-sm>
            <v-row
              align="center"
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
                  banner-class="text-left"
                  icon="cloud-check-outline"
                  text="Device connected!"
                  data-cy="edge-device-connected"
                  ref="edge-device-connected"
                />
                <v-card
                  class="mx-auto text-left"
                  flat
                >
                  <v-list
                    two-line
                  >
                    <amb-list-item
                      ref="list-item-notificationsProvider"
                      data-cy="list-item-notificationsProvider"
                      title="IFTTT"
                      subtitle="Service Provider"
                      icon-name="api"
                    />
                    <amb-list-item
                      ref="list-item-apiKey"
                      data-cy="list-item-apiKey"
                      title="__MY__KEY__"
                      subtitle="Enter Your IFTTT API Key"
                      :edit-option="true"
                      :sensitive-field="true"
                      icon-name="key"
                    />
                    <amb-list-item
                      ref="list-item-apiTarget"
                      data-cy="list-item-apiTarget"
                      title="ambianic-notification"
                      subtitle="Event Name to Trigger"
                      edit-option="true"
                      icon-name="target"
                    />
                    <v-list-item>
                      <v-list-item-content>
                          <a
                            href="https://docs.ambianic.ai/users/ifttt/"
                            target="_new_window"
                          >
                            How to configure notifications?
                          </a>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="connectToEdgeDevice"
              :disabled="isEdgeConnecting"
              color="primary"
            >
              Test
            </v-btn>
            <v-spacer />
            <v-btn
              @click="connectToEdgeDevice"
              :disabled="isEdgeConnecting"
              color="warning"
            >
              Update
            </v-btn>
            <v-btn
              @click="forgetDeviceDialog = true"
              :disabled="isEdgeConnecting"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
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
            No device connection
          </v-card-title>
          <v-card-text grid-list-sm>
            Go ahead and connect to a device.
          </v-card-text>
          <v-card-actions>
            <v-btn
              to="/settings"
            >
              Settings
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
      edgeVersion: this.$store.state.myDevices.currentDeviceCard ? this.$store.state.myDevices.currentDeviceCard.version : '',
      edgeDisplayName: this.$store.state.myDevices.currentDeviceCard ? this.$store.state.myDevices.currentDeviceCard.displayName : '',
      edgeDeviceError: null,
      isSyncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (!!value && value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      },
      forgetDeviceDialog: false,
      enableNotifications: false,
      breadcrumbs: [
        {
          text: 'Settings',
          disabled: false,
          to: '/settings'
        },
        {
          text: 'Device Card',
          disabled: false,
          to: '/devicecard'
        },
        {
          text: 'Notifications Config',
          disabled: true
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
          this.edgeDeviceError = 'Edge device requires update.'
        } else {
          // save device details in local db
          details.peerID = this.edgePeerId
          await this.updateFromRemote(details)
        }
      } catch (err) {
        this.edgeDeviceError = 'Edge device API offline or unreachable.'
        console.error('Error while fetching remote device status', { err })
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
      await this.$router.replace({ name: 'settings' })
    }
  },
  computed: {
    isLoading: function () { return this.isSyncing || this.isEdgeConnecting || this.isEdgeDisconnecting },
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
      currentDeviceCard: state => state.myDevices.currentDeviceCard
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
    },
    currentDeviceCard: async function (newVal, oldVal) {
      console.debug('Current Edge Device Card changed:', { newVal, oldVal })
      if (newVal) {
        this.edgeVersion = newVal.version
        this.edgeDisplayName = newVal.displayName
      } else {
        // right after the user requests to "Forget" a device
        // there is no current device selected
        this.edgeVersion = ''
        this.edgeDisplayName = ''
      }
    }
  }
}
</script>
