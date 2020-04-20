<template>
  <app-frame>
    <v-col
        v-if="edgePeerId"
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-banner
          v-if="isEdgeConnected"
          two-line
          class="text-left"
        >
          <v-icon
            slot="icon"
            size="36"
          >
            mdi-wifi
          </v-icon>
          Ambianic Edge device connected!
        </v-banner>
        <v-banner
          v-else
          two-line
          class="text-left"
        >
          <v-icon
            slot="icon"
            size="36"
          >
            mdi-wifi-off
          </v-icon>
          Connecting to Ambianic Edge device...
          <v-progress-linear
            color="info"
            indeterminate
            :size="50"
            :width="7"
          >
          </v-progress-linear>
        </v-banner>

        <v-card
          class="mx-auto text-left"
        >
          <v-list two-line
          >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>My Ambianic Edge Device</v-list-item-title>
                  <v-list-item-subtitle>Display Name</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-identifier</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ edgePeerId }}</v-list-item-title>
                  <v-list-item-subtitle>Peer ID</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-alpha-v</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ version }}</v-list-item-title>
                  <v-list-item-subtitle>Release Version</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

          </v-list>
          <v-btn text
            :to="'timeline'"
          >
            OK
          </v-btn>
          <v-btn text
            @click.stop="resetEdgeDialog = true"
          >
            Reset
          </v-btn>
        </v-card>
      </v-col>
    <form>
      <p>Enter details for Remote Network</p>
      <label for="ambianicIPAddress">IP to Ambianic Network</label>
      <input
        type="text"
        id="ambianicIPAddress"
        class="inputbox"
      >
      <button @click="connect">
        Submit
      </button>
    </form>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
import axios from 'axios'
// import { settingsDB } from '@/store/db'
import { mapState } from 'vuex'
import {
  PEER_DISCONNECTED,
  PEER_DISCOVERING,
  PEER_DISCOVERED,
  PEER_CONNECTING,
  PEER_AUTHENTICATING,
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR
} from '@/store/mutation-types'

export default {

  data: function () {
    return {
      // edgeAddress: '',
      connectionStatus: '',
      connectionTip: '',
      testInProgress: false,
      testDone: true,
      statusColor: 'info',
      resetEdgeDialog: false
    }
  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      // map this.edgeConnected to this.$store.state.edgeConnected
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      version: state => state.version
    }),
    connectStep: function () {
      let step = 1
      switch (this.peerConnectionStatus) {
        case PEER_DISCONNECTED:
        case PEER_CONNECTION_ERROR:
          step = 1
          break
        case PEER_DISCOVERING:
        case PEER_DISCOVERED:
        case PEER_CONNECTING:
        case PEER_AUTHENTICATING:
          step = 2
          break
        case PEER_CONNECTED:
          step = 3
          break
        default:
          break
      }
      return step
    }
  },
  components: {
    AppFrame
  },
  mounted () {},
  beforeDestroy () {},
  methods: {
    connect: function () {
      axios.get('http://3.17.16.13/')
        .then(response => (console.log(response)))
    }
  }
}
</script>
<style scoped>
  .inputbox {
    border: 1px solid gray;
  }
</style>
