<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
      class="container"
    >
      <div class="local">
        <p class="text">
          Connect to local network
        </p>
        <router-link :to="'edge-connect'">
          <v-btn class="localButton">
            Local Network
          </v-btn>
        </router-link>
      </div>
      <div class="middleLine">
        OR
      </div>
      <div class="remote">
        <form class="text">
          Connect to remote network
          <h6 class="fineDetails">
            (must enter room ID to Ambianic network)
          </h6>
          <p />
          <label
            for="ambianicEdgeAddress"
            class="fineDetails"
          >
            Room ID to Ambianic Network*
          </label>
          <p>
            <input
              type="text"
              id="ambianicEdgeAddress"
              class="inputbox"
              placeholder="Enter ID"
              v-model="edgeAddress"
            >
          </p>
          <p>
            <router-link
              v-if="correctEdgeAddress"
              :to="'edge-connect'"
            >
              <v-btn @click="sendEdgeAddress">
                REMOTE NETWORK
              </v-btn>
            </router-link>
          </p>
        </form>
      </div>
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
import { REMOVE_REMOTE_PEER_ID } from '../store/action-types'
import { PEER_CONNECTED } from '../store/mutation-types'

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
  computed: {},
  methods: {
    // Validate the user input so the ID has the correct format before showing the connect button
    validateIP (value) {
      if (/^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(value)) {
        this.correctEdgeAddress = true
        return this.correctEdgeAddress
      } else {
        this.correctEdgeAddress = false
        return this.correctEdgeAddress
      }
    },
    sendEdgeAddress () {
      this.$store.state.pnp.edgeRoom = this.edgeAddress
    }
  },
  mounted () {
    // If you route back to this page, disconnect so you can reconnect to another ID
    if (this.$store.state.pnp.peerConnectionStatus === PEER_CONNECTED) {
      this.$store.dispatch(REMOVE_REMOTE_PEER_ID)
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
.container {
  width: 50%;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
}

#ambianicEdgeAddress {
  border: 2px ridge lightgray;
  padding: 6px;
  border-radius: 5px;
  width: 81%;
}

hr {
  margin: 1rem 0;
}

a {
  text-decoration: none;
}

.localButton {
  margin: 35px 0 0 20px;
}

.text {
  font-size: 18px;
}

.fineDetails {
  font-size: 10px;
}

.local {
  display: inline-block;
  margin: 50px 0;
  padding: 30px;
}

.remote {
  display: inline-block;
  margin: 50px 0;
  padding: 30px;
}

.middleLine {
  display: inline-block;
  margin: 40px 0;
  padding: 30px 0 0 0;
  font-weight: bolder;
  font-size: 28px;
}
</style>
