<template>
  <app-frame>
    <v-row
      v-if="!isEdgeConnected"
      align="start"
      justify="center"
    >
      <!-- top column -->
      <v-col cols="6">
        <v-card min-width="100">
          <v-card-text class="text-center">
            <p class="text">
              Connect to local network
            </p>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center">
              <v-btn
                :to="'edge-connect'"
                color="primary"
                :small="$vuetify.breakpoint.mdAndUp"
              >
                <v-icon v-if="$vuetify.breakpoint.xsOnly">
                  mdi-wifi
                </v-icon>
                <span v-if="$vuetify.breakpoint.smAndUp">
                  Local Network
                </span>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- middle column -->
      <v-col cols="12">
        <v-row justify="center">
          <v-card flat>
            <v-card-title>
              OR
            </v-card-title>
          </v-card>
        </v-row>
      </v-col>
      <!-- third column -->
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
            :to="'edge-connect'"
            @click="sendEdgeAddress"
            color="primary"
          >
            REMOTE NETWORK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <div
      v-else
    >
      {{ this.$router.push('edge-connect') }}
    </div>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
import {
  REMOVE_REMOTE_PEER_ID
} from '../store/action-types.js'

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
    },
    redirect () {
      console.log('Redirect!!!!!!')
    }
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
