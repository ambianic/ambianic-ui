<template>
  <amb-app-frame>
    <v-container
      fluid
    >
      <v-row
        dense
      >
        <v-col class="ma-0 pa-0">
          <v-breadcrumbs :items="breadcrumbs"/>
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
  PEER_CONNECTION_ERROR,
  PEER_CONNECTING,
  PEER_DISCONNECTING,
  PEER_AUTHENTICATING
} from '@/store/mutation-types'

export default {
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    MyDevices: () => import('@/components/MyDevices.vue')
  },
  data () {
    return {
      reveal: false,
      edgeAddress: undefined,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      breadcrumbs: [
        {
          text: 'Settings',
          disabled: false,
          to: 'settings'
        },
        {
          text: 'Select Device',
          disabled: true,
          to: 'selectdevice'
        }
      ]
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
      edgeDisplayName: state => state.myDevices.currentDeviceCard.displayName,
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
