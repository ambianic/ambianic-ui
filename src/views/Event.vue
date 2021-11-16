<template>
  <amb-app-frame>
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
      align="start"
      justify="center"
      dense
    >
      <v-col
        :style="maxWidth"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <event-card
          v-if="isEdgeConnected"
          :data="eventData"
          ref="event-card"
        />
        <v-progress-circular
          indeterminate
        />
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
import { mapState } from 'vuex'
import {
  PEER_CONNECTED,
} from '@/store/mutation-types'

export default {
  data () {
    return {
      maxWidth: '',
      edgeDeviceError: null
    }
  },
  created () {
  },
  mounted () {
    const maxPixels = window.innerWidth < 600 ? window.innerWidth : 600
    this.maxWidth = `max-width: ${maxPixels}px;`
    // TODO
    // decrypt remote edge device peer id from event URL params and establish peer connection
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
      pnp: state => state.pnp
    })
  },
  methods: {
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
