<template>
  <amb-app-frame>
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
      v-if="edgePeerId"
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
                v-if="isEdgeConnected"
                banner-class="text-left"
                icon="cloud-check-outline"
                text="Device connected!"
                data-cy="edge-device-connected"
                ref="edge-device-connected"
              />
              <amb-banner
                v-else
                banner-class="text-left"
                icon="cloud-off-outline"
                icon-color="info"
                text="Device disconnected."
                data-cy="edge-device-disconnected"
                ref="edge-device-disconnected"
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
                  <v-list-item>
                    <!-- Notifications list item -->
                    <v-list-item-avatar>
                      <v-icon>
                        mdi-bell-outline
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-switch
                        v-model="notificationsEnabled"
                        :label="`Notifications ${ notificationsEnabled ? &quot;On&quot; : &quot;Off&quot; }`"
                        :disabled="!isEdgeConnected"
                        @change="onEnableNotifications"
                      />
                    </v-list-item-content>
                    <v-list-item-action
                      v-if="isEdgeConnected"
                    >
                      <v-tooltip
                        bottom
                      >
                        <template #activator="{ onNotificationsConfigEvents, notificationsConfigProps }">
                          <v-icon
                            @click="notificationsConfigClicked"
                            data-cy="icon-notifications-config"
                            ref="icon-notifications-config"
                            v-bind="notificationsConfigProps"
                            v-on="onNotificationsConfigEvents"
                          >
                            tune
                          </v-icon>
                        </template>
                        <span>Configure notifications.</span>
                      </v-tooltip>
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
        width="344"
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
          No device selected
        </v-card-title>
        <v-card-text grid-list-sm>
          Go ahead and pick a device to connect to.
        </v-card-text>
        <v-card-actions>
          <v-btn
            to="selectdevice"
          >
            My Devices
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
      notificationsEnabled: false,
      breadcrumbs: [
        {
          text: 'Settings',
          disabled: false,
          to: 'settings'
        },
        {
          text: 'Device Card',
          disabled: true,
          to: 'devicecard'
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
    this.notificationsEnabled = this.currentDeviceCard.notificationsEnabled
    if (this.isEdgeConnected) {
      await this.fetchEdgeDetails()
    }
  },
  methods: {
    ...mapActions({
      deleteCurrentDeviceConnection: REMOVE_REMOTE_PEER_ID,
      forgetDeviceCard: 'myDevices/forget',
      updateDisplayName: 'myDevices/updateDisplayName',
      updateNotificationsEnabled: 'myDevices/updateNotificationsEnabled',
      updateFromRemote: 'myDevices/updateFromRemote',
      setCurrentDevice: 'myDevices/setCurrent',
      peerConnect: PEER_CONNECT
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
    async onEnableNotifications () {
      try {
        this.isSyncing = true
        await this.pnp.edgeAPI.enableNotifications(this.notificationsEnabled)
        await this.updateNotificationsEnabled({ peerID: this.edgePeerId, enabled: this.notificationsEnabled })
      } catch (e) {
        this.edgeDeviceError = 'Error updating notifications settings. Edge device offline or has outdated API.'
        console.error('Exception calling onEnableNotifications()', { e })
      } finally {
        this.isSyncing = false
      }
    },
    async connectToEdgeDevice () {
      await this.peerConnect(this.edgePeerId)
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
    },
    async notificationsConfigClicked () {
      await this.$router.replace({ name: 'deviceNotificationsConfig' })
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
        this.notificationsEnabled = this.currentDeviceCard.notificationsEnabled
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
