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
                      title="__ENTER_NEW_KEY__"
                      subtitle="IFTTT Webhooks API Key"
                      :edit-option="true"
                      :sensitive-field="true"
                      icon-name="key"
                      :on-submit="onIftttKeyChanged"
                      :rules="[rules.required, rules.counter]"
                    />
                    <v-list-item>
                      <v-list-item-content>
                        <a
                          href="https://docs.ambianic.ai/users/ifttt/"
                          target="_new_window"
                        >
                          How does this work?
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
              @click="testNotifications"
              :disabled="isEdgeConnecting"
              color="primary"
            >
              Test
            </v-btn>
            <v-spacer />
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
        counter: value => (!!value && value.length >= 5 && value.length <= 50) || 'Min 5 and Max 50 characters'
      },
      forgetDeviceDialog: false,
      notificationsEnabled: false,
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
  },
  methods: {
    ...mapActions({
    }),
    async onIftttKeyChanged (newIftttKey) {
      console.debug(`onIftttKeyChanged(): ${newIftttKey}`)
      let updated = false
      if (newIftttKey) {
        try {
          console.debug(`New IFTTT Key: ${newIftttKey}`)
          // trigger edit change callback
          //    show blocking dialog with spinner https://vuetifyjs.com/en/components/dialogs/#loader
          //    await dispatch to push new device display name: 1. to device, 2. to local device store
          this.isSyncing = true
          // send changes to remote edge device
          await this.pnp.edgeAPI.setIftttKey(newIftttKey)
          updated = true
        } catch (e) {
          this.edgeDeviceError = 'Error updating IFTTT Key. Edge device offline or has outdated API.'
          console.error('Exception calling setIftttKey()', { e })
        } finally {
          this.isSyncing = false
        }
      }
      return updated
    },
    async testNotifications () {
      // TODO
      // remote API call to edge device: /api/notifications/test
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
