<!-- App.vue -->
<template>
  <v-lazy>
      <v-app>
        <router-view />
      </v-app>
  </v-lazy>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions({
      syncState: 'myDevices/syncState',
      setCurrentDevice: 'myDevices/setCurrent'
    })
  },
  computed: {
    ...mapState({
      edgePeerId: state => state.pnp.remotePeerId,
      currentDeviceCard: state => state.myDevices.currentDeviceCard
    })
  },
  async created () {
    // sync vuex state with localdb on app init
    await this.syncState()
    if (this.edgePeerId) {
      this.setCurrentDevice(this.edgePeerId)
    }
    console.debug('App created. Edge PeerID, currentDeviceCard:', this.edgePeerId, this.currentDeviceCard)
  }
}
</script>
