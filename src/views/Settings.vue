<template>
  <amb-app-frame>
    <v-container
      fluid
    >
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
      >
        <v-card
          :loading="isLoading"
          :disabled="isLoading"
        >
          <v-card-title
            data-cy="device-card-title"
            ref="device-card-title"
            v-if="edgePeerId"
          >
            {{ edgeDisplayName }}
          </v-card-title>
          <v-card-title
            data-cy="device-card-title"
            ref="device-card-title"
            v-else
          >
            Select a device
          </v-card-title>
          <v-card-subtitle
            data-cy="device-card-title"
            v-if="edgePeerId"
          >
            My current device
          </v-card-subtitle>
          <v-card-subtitle
            data-cy="device-card-title"
            v-else
          >
            Add or select a device to connect to.
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
                  <v-switch
                    v-model="connectToEdgeSwitch"
                    :label="`${ isEdgeConnected ? &quot;Connected&quot; : &quot;Disconnected&quot; }`"
                  />
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip
                    bottom
                  >
                    <template #activator="{ onDeviceConfigEvents, deviceConfigProps }">
                      <v-icon
                        @click="{{ $router.replace('/devicecard') }}"
                        data-cy="btn-device-config"
                        ref="btn-device-config"
                        v-bind="deviceConfigProps"
                        v-on="onDeviceConfigEvents"
                      >
                        tune
                      </v-icon>
                    </template>
                    <span>Device Settings.</span>
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
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              ref="mydevices-btn"
              data-cy="mydevices-btn"
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
import {
  PEER_CONNECT,
  PEER_DISCONNECT
} from '@/store/action-types'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    AmbListItem: () => import('@/components/shared/ListItem.vue')
  },
  data () {
    return {
      edgeAddress: undefined,
      edgeDeviceError: null,
      connectToEdgeSwitch: false,
      edgeDisplayName: this.$store.state.myDevices.currentDeviceCard ? this.$store.state.myDevices.currentDeviceCard.displayName : ''
    }
  },
  created () {
  },
  mounted () {
    this.connectToEdgeSwitch = this.isEdgeConnected
  },
  methods: {
    ...mapActions({
      setCurrentDevice: 'myDevices/setCurrent',
      peerConnect: PEER_CONNECT,
      peerDisconnect: PEER_DISCONNECT
    })
  },
  computed: {
    isLoading: function () { return this.isEdgeConnecting || this.isEdgeDisconnecting },
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isPeerConnectionError: state => state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      isEdgeConnecting: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTING ||
        state.pnp.peerConnectionStatus === PEER_AUTHENTICATING,
      isEdgeDisconnecting: state =>
        state.pnp.peerConnectionStatus === PEER_DISCONNECTING,
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
    },
    currentDeviceCard: async function (newVal, oldVal) {
      console.debug('Current Edge Device Card changed:', { newVal, oldVal })
      this.edgeVersion = newVal.version
      this.edgeDisplayName = newVal.displayName
    },
    isEdgeConnected: async function (newVal, oldVal) {
      this.connectToEdgeSwitch = newVal
    },
    connectToEdgeSwitch: async function (newVal, oldVal) {
      if (newVal === true) {
        await this.peerConnect(this.edgePeerId)
      } else {
        await this.peerDisconnect()
      }
    }
  }
}
</script>
