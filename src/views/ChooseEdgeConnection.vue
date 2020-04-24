<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
      class="container"
    >
      <form>
        Connect to a
        <router-link :to="{name: 'edge-connect', params: {edgeAddress: 'localhost'}}">
          <v-btn>
            Local Network
          </v-btn>
        </router-link>
        <hr>
        <p>Enter details for Remote Network</p>
        <label for="ambianicIPAddress">IP to Ambianic Network</label>
        <input
          type="text"
          id="ambianicIPAddress"
          class="inputbox"
          placeholder="Enter IP"
          v-model="ipAddress"
        >
        <router-link :to="{name: 'edge-connect', params: {edgeAddress: ipAddress}}">
          <v-btn
            :disabled="!ipAddress"
          >
            Connect
          </v-btn>
        </router-link>
      </form>
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
</style>
