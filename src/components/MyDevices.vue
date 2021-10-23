<template>
  <!-- Shows a list of user's known edge devices and lets them pick one or add new. -->
  <v-card
    class="transition-fast-in-fast-out v-card--reveal"
    style="height: 100%;"
    width="344"
  >
    <v-card-title>
      My Devices:
    </v-card-title>
    <v-card-text
      class="pb-0 dottedBorder"
      color="warning"
      v-if="!allDeviceCards"
    >
      <p>No device added.</p>
    </v-card-text>
    <v-card-text
      class="pb-0"
      v-else
    >
      <v-list
        two-line
      >
        <v-radio-group :mandatory="true" v-model="selectedDeviceID">
            <template
              v-for="device in allDeviceCards"
            >
              <v-list-item
                  :key="device.peerID"
              >
                  <v-list-item-action>
                    <v-radio :value="device.peerID" :key="device.peerID" />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ device.displayName }}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
            </template>
        </v-radio-group>
      </v-list>
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
    <v-card-actions>
      <v-btn
        @click="switchDevice"
        :disabled="isSelectedDeviceCurrent"
      >
        <span>Switch Device</span>
        <v-icon>alt_route</v-icon>
      </v-btn>
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
      addDeviceDialog: false,
      selectedDeviceID: ''
    }
  },
  async created () {
    await this.loadAllCards()
    console.debug('created () : allDeviceCards -> ', this.allDeviceCards)
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      switchEdgeDevice: CHANGE_REMOTE_PEER_ID,
      loadAllCards: 'myDevices/loadAll'
    }),
    async switchDevice () {
      await this.switchEdgeDevice(this.selectedDeviceID)
    },
    pickDevice ({ id }) {
      this.selectedDeviceID = id
    }
  },
  computed: {
    isSelectedDeviceCurrent: function (state) { return (this.selectedDeviceID === state.pnp.remotePeerId) },
    ...mapState({
      allDeviceCards: state => state.myDevices.allDeviceCards,
      currentDevicePeerId: state => state.pnp.remotePeerId,
      pnp: state => state.pnp
    })
  }
}
</script>

<style>
.dottedBorder {border-style: dashed; opacity: 0.5  }
</style>
