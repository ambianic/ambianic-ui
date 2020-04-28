<template>
  <app-frame>
    <v-row align="start" justify="space-around" class="container">
      <div class="local">
        <p class="text">Connect to local network</p>
        <router-link :to="{name: 'edge-connect', params: {edgeAddress: 'localhost'}}">
          <v-btn class="localButton">Local Network</v-btn>
        </router-link>
      </div>
      <div class="middleLine">OR</div>
      <div class="remote">
        <form class="text">
          Connect to remote network
          <h6 class="fineDetails">(must enter IP to Ambianic network)</h6>
          <p></p>
          <label for="ambianicIPAddress" class="fineDetails">IP to Ambianic Network*</label>
          <p>
            <input
              type="text"
              id="ambianicIPAddress"
              class="inputbox"
              placeholder="Enter IP"
              v-model="ipAddress"
            />
          </p>
          <p>
            <router-link v-if="correctIP" :to="{name: 'edge-connect', params: {edgeAddress: ipAddress}}">
              <v-btn>REMOTE NETWORK</v-btn>
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
      ipAddress: '',
      correctIP: false
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
    validateIP (value) {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
        this.correctIP = true
        return this.correctIP
      } else {
        console.log('Error')
      }
    }
  },
  components: {
    AppFrame
  },
  watch: {
    ipAddress (value) {
      this.ipAddress = value
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

#ambianicIPAddress {
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
