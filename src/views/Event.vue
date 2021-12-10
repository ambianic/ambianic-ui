<template>
  <amb-app-frame>
    <v-row
      align="start"
      v-if="this.edgeDeviceError"
    >
      <v-col
        cols="12"
      >
        <v-alert
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
      align="start"
      justify="center"
      dense
      v-else
    >
      <v-col
        :style="maxWidth"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-card class="text-center">
          <event-card
            v-if="isEdgeConnected"
            :data="eventData"
            ref="event-card"
          />
          <v-card-text
            ref="loading-card"
            v-else
          >
            <p>
              Loading event info...
            </p>
            <v-progress-circular
              size="50"
              indeterminate
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </amb-app-frame>
</template>
<style lang="stylus" scoped>
.see-thru {
  opacity: 0.8
}
</style>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error", "debug", "info"] }] */
import sjcl from 'sjcl'
import { mapActions, mapState } from 'vuex'
import {
  PEER_CONNECTED
} from '@/store/mutation-types'
import {
  PEER_CONNECT
} from '@/store/action-types'

export default {
  data () {
    return {
      eventData: undefined,
      maxWidth: '',
      edgeDeviceError: undefined
    }
  },
  created () {
  },
  mounted () {
    const maxPixels = window.innerWidth < 600 ? window.innerWidth : 600
    this.maxWidth = `max-width: ${maxPixels}px;`
    this.decryptQuery()
  },
  beforeDestroy () {
  },
  components: {
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    EventCard: () => import('@/components/EventCard')
  },
  computed: {
    ...mapState({
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      pnp: state => state.pnp,
      allDeviceCards: state => state.myDevices.allDeviceCards
    })
  },
  methods: {
    ...mapActions({
      syncState: 'myDevices/syncState',
      setCurrentDevice: 'myDevices/setCurrent',
      peerConnect: PEER_CONNECT
    }),
    /**
     * Decrypt remote edge device peer id from event URL params and establish peer connection
     */
    async decryptQuery () {
      // first make sure vuex is synced with localdb
      // otherwise allDeviceCards may be empty
      const urlParams = this.$route.query
      console.debug('URL params', urlParams)
      if (!this.$route.query.peerid_hash) {
        this.eventData = undefined
        const errorMessage = 'Event query parameters missing.'
        this.edgeDeviceError = errorMessage
        console.debug({ errorMessage })
      } else {
        await this.syncState()
        const peeridHash = this.$route.query.peerid_hash
        let argsString = this.$route.query.args
        argsString = argsString.replaceAll("'", '"')
        console.debug(`type of args is ${typeof argsString}`, { argsString })
        const args = JSON.parse(argsString)
        const eventID = args.id
        console.debug({ peeridHash, args, eventID })
        const eventOriginatingDevicePeerID = this.decryptPeerID({ peeridHash, eventID })
        console.debug({ eventOriginatingDevicePeerID })
        if (!eventOriginatingDevicePeerID) {
          this.eventData = undefined
          this.edgeDeviceError = 'Event hash does not match any of your saved devices.'
        } else {
          this.edgeDeviceError = undefined
          this.eventData = {
            priority: this.$route.query.priority,
            message: this.$route.query.message,
            args
          }
          await this.connectToDevice(eventOriginatingDevicePeerID)
        }
      }
    },
    decryptPeerID ({ peeridHash, eventID }) {
      const allPeerIDs = Array.from(this.allDeviceCards.keys())
      const allCards = this.allDeviceCards
      console.debug({ allPeerIDs, allCards })
      const matchingPeerID = allPeerIDs.find(pid => {
        const myString = pid + eventID
        const myBitArray = sjcl.hash.sha256.hash(myString)
        const myHash = sjcl.codec.hex.fromBits(myBitArray)
        console.debug({ pid, eventID, myHash, peeridHash })
        if (myHash === peeridHash) {
          return pid
        }
      })
      return matchingPeerID
    },
    async connectToDevice (peerID) {
      await this.peerConnect(peerID)
      await this.setCurrentDevice(peerID)
    }
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
