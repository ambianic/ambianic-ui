<!-- For the moment, this component is not used.
All is moved into Settings.vue -->
<template>
  <app-frame>
    <v-card
      max-width="500"
      class="text-center"
    >
      <v-card-text>
        <p class="text">
          Connect to remote network
        </p>
        <v-subheader>
          (must enter Peer ID to Ambianic network)
        </v-subheader>
        <v-text-field
          v-model="edgeAddress"
          type="text"
          label="Peer ID to Ambianic Network*"
          placeholder="Enter Peer ID"
          outlined
          dense
          class="mt-4"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          :disabled="!correctEdgeAddress"
          @click="sendEdgeAddress"
          color="primary"
        >
          REMOTE NETWORK
        </v-btn>
      </v-card-actions>
    </v-card>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
import {
  REMOVE_REMOTE_PEER_ID
} from '../store/action-types.js'
import { mapState } from 'vuex'
import {
  PEER_CONNECTED
} from '@/store/mutation-types'

export default {
  data: () => {
    return {
      edgeAddress: '',
      correctEdgeAddress: false
      // connectionStatus: '',
      // connectionTip: '',
      // testInProgress: false,
      // testDone: true,
      // statusColor: 'info',
      // resetEdgeDialog: false
    }
  },
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validateIP (value) {
      if (/^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)) {
        this.correctEdgeAddress = true
        return this.correctEdgeAddress
      } else {
        // if value is not matching regex, remove button
        this.correctEdgeAddress = false
        return this.correctEdgeAddress
      }
    },
    sendEdgeAddress () {
      this.$store.state.pnp.edgeRoom = this.edgeAddress
      this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
    }
  },
  computed: {
    ...mapState({
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED
    })
  },
  components: {
    AppFrame
  },
  watch: {
    edgeAddress (value) {
      this.edgeAddress = value
      this.validateIP(value)
    }
  }
}
</script>
<style scoped>
#ambianicEdgeAddress {
  border: 2px ridge lightgray;
  padding: 6px;
  border-radius: 5px;
  width: 81%;
}

.text {
  font-size: 18px;
}
</style>
