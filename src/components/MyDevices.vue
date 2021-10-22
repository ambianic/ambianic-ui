<template>
  <!-- Shows a list of user's known edge devices and lets them pick one or add new. -->
  <v-card
    class="transition-fast-in-fast-out v-card--reveal"
    style="height: 100%;"
    width="344"
  >
    <v-card-title>
      My Devices
    </v-card-title>
    <v-card-text
      class="pb-0 dottedBorder"
      color="warning"
      v-if="!all"
    >
      <p>No devices added.</p>
    </v-card-text>
    <v-card-text
      class="pb-0"
      v-else
    >
      <p class="text-h4 text--primary">
        My Devices:
      </p>
      <p>...</p>
    </v-card-text>
    <v-card-text style="height: 100px; position: relative">
      <v-fab-transition>
        <v-btn
          color="accent"
          absolute
          bottom
          right
          large
          fab
          @click="addDeviceDialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-card-text>
    <v-card-actions class="pt-0">
    </v-card-actions>
    <v-dialog
      v-model="addDeviceDialog"
      max-width="344"
    >
      <v-card>
        <v-card-title>
          Add Device
        </v-card-title>

        <v-card-text>
          Proceed to adding a new device connection?
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            to="adddevice"
          >
            Continue
          </v-btn>
          <v-spacer />
          <v-btn
            @click="addDeviceDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  CHANGE_REMOTE_PEER_ID
} from '../store/action-types.js'

export default {
  components: {
  },
  data () {
    return {
      addDeviceDialog: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'CHANGE_REMOTE_PEER_ID'
    ]),
    async selectAnotherEdgeDevice () {
      await this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.edgeAddress)
    }
  },
  computed: {
    ...mapState({
      pnp: state => state.pnp,
      all: state => state.myDevices.getAll,
      myDevices: state => state.myDevices
    })
  }
}
</script>

<style>
.dottedBorder {border-style: dashed; opacity: 0.5  }
</style>
