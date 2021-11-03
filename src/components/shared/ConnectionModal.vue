<template>
  <v-dialog
    v-model="visibility"
    persistent
    max-width="300"
  >
    <v-card>
      <v-card-text
        color="accent"
      >
        Connecting to Ambianic Edge device
        <v-progress-linear
          indeterminate
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { PEER_CONNECTING, PEER_AUTHENTICATING } from '@/store/mutation-types'

export default {
  name: 'ConnectionStatusSnackbar',
  data: () => ({
    message: 'Connecting to Ambianic Edge device'
  }),
  components: {
  },
  created () {
  },
  computed: {
    ...mapState({
      visibility: state => state.pnp.peerConnectionStatus === PEER_CONNECTING || state.pnp.peerConnectionStatus === PEER_AUTHENTICATING
    })
  },
  methods: {
  },
  watch: {
  }
}
</script>
