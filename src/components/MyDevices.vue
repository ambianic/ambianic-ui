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
      v-if="noKnownDevices"
    >
      <p>No devices added.</p>
    </v-card-text>
    <v-card-text
      class="pb-0"
      v-else
    >
      <v-list
        two-line
      >
        <v-radio-group
          v-model="newSelectedDeviceID"
        >
          <template
            v-for="device in allDeviceCards.values()"
          >
            <v-list-item
              :key="device.peerID"
            >
              <v-list-item-action>
                <v-radio
                  :value="device.peerID"
                  :key="device.peerID"
                />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ device.displayName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-radio-group>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="switchDevice"
        :disabled="isSelectedDeviceCurrent"
        v-if="!noKnownDevices"
      >
        <span>Switch Device</span>
        <v-icon>alt_route</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        color="accent"
        @click="addDeviceDialog = true"
      >
        <v-icon>mdi-plus</v-icon> Add Device
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="addDeviceDialog"
      width="344"
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
      addDeviceDialog: false,
      newSelectedDeviceID: ''
    }
  },
  created () {
  },
  mounted () {
    this.newSelectedDeviceID = this.currentDevicePeerId
  },
  methods: {
    ...mapActions({
      switchEdgeDeviceConnection: CHANGE_REMOTE_PEER_ID,
      setCurrentDevice: 'myDevices/setCurrent'
    }),
    async switchDevice () {
      // update current device card details from local db
      // replacing previous device card details
      await this.setCurrentDevice(this.newSelectedDeviceID)
      // do not await connection to complete since we are going to the device card page
      this.switchEdgeDeviceConnection(this.newSelectedDeviceID)
      this.$router.push({ name: 'devicecard' })
    }
  },
  computed: {
    isSelectedDeviceCurrent: function (state) { return (this.newSelectedDeviceID === state.pnp.remotePeerId) },
    ...mapState({
      allDeviceCards: state => state.myDevices.allDeviceCards,
      noKnownDevices: state => !state.myDevices.allDeviceCards || state.myDevices.allDeviceCards.size === 0,
      currentDevicePeerId: state => state.pnp.remotePeerId,
      pnp: state => state.pnp
    })
  }
}
</script>

<style>
.dottedBorder {border-style: dashed; opacity: 0.5  }
</style>
