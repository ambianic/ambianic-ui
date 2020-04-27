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
        <router-link :to="{name: 'edge-connect', params: {edgeAddress: 'localhost'}}">
          <v-btn class="localButton">
            Local Network
          </v-btn>
        </router-link>
      </div>
      <div class="middleLine">OR</div>
      <div class="remote">
          <form class="text">
        Connect to remote network
        <h6 class="fineDetails">(must enter room ID to Ambianic network)</h6>
        <p></p>
        <label for="ambianicIPAddress" class="fineDetails">Room ID to Ambianic Network</label>
        <p>
        <input
          type="text"
          id="ambianicIPAddress"
          class="inputbox"
          placeholder="Enter Room ID"
          v-model="ipAddress"
        >
        </p>
        <p>
        <router-link :to="{name: 'edge-connect', params: {edgeAddress: ipAddress}}">
          <v-btn
            :disabled="!ipAddress"
          >
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
export default {
  data: () => {
    return {
      ipAddress: ''
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
  },
  components: {
    AppFrame
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
