<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
    Hellow
        {{edgeAddress}}
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
// import { settingsDB } from '@/store/db'
// import { mapState, mapActions } from 'vuex'
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
  props: [
    'edgeAddress'
  ],
  data: function () {
    return {
      // connectionStatus: '',
      // connectionTip: '',
      // testInProgress: false,
      // testDone: true,
      // statusColor: 'info',
      // resetEdgeDialog: false
    }
  },
  computed: {
    peerConnectionError: function () {
      console.log('this.$store.state.pnp.peerConnectionStatus', this.$store.state.pnp.peerConnectionStatus)
      return this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR
    },
    // ...mapState({
    //   peerConnectionStatus: state => state.pnp.peerConnectionStatus,
    //   // map this.edgeConnected to this.$store.state.edgeConnected
    //   isEdgeConnected: state =>
    //     state.pnp.peerConnectionStatus === PEER_CONNECTED,
    //   edgePeerId: state => state.pnp.remotePeerId,
    //   peerFetch: state => state.pnp.peerFetch,
    //   version: state => state.version
    // }),
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
  mounted () {
    this.loadSettings()
  },
  beforeDestroy () {
  },
  methods: {
    resetEdgeConnection () {
      this.resetEdgeDialog = false
      this.removeEdgeId()
    },
    loadSettings () {
      // settingsDB.get('ambanic-edge-address').then(
      //   (address) => {
      //     this.edgeAddress = address
      //   }
      // )
    },
    saveSettings () {
      // settingsDB.set('ambanic-edge-address', this.edgeAddress)
    }
    // ...mapActions({
    //   removeEdgeId: 'removeRemotePeerId' // map `this.add()` to `this.$store.dispatch('increment')`
    // })
  }
}

</script>
