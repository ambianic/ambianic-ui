<template>
  <amb-app-frame>
    <v-container
      fluid
    >
      <v-row
        align="center"
      >
        <v-col cols="12">
          <v-alert
            v-if="this.edgeDeviceError"
            outlined
            type="warning"
            dense
            align-self="center"
            class="text-center"
            transition="scale-transition"
            dismissible
            data-cy="edge-device-error"
            ref="edge-device-error"
          >
            {{ this.edgeDeviceError }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-dialog
          v-model="syncing"
          persistent
          max-width="300"
        >
          <v-card>
            <v-card-text
              color="accent"
            >
              Syncing with Ambianic Edge device
              <v-progress-linear
                indeterminate
              />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row
        justify="center"
        class="pb-5"
        align="center"
      >
        <v-card flat>
          <v-card-title
            data-cy="titlecard"
          >
            Ambianic Edge connection details
          </v-card-title>
          <v-card-text grid-list-sm>
            <v-row
              align="start"
              justify="space-around"
            >
              <v-col
                v-if="edgePeerId"
                ...
                supply
                edge
                peer
                id
                to
                this
                page
                so
                it
                can
                render
                device
                details
                card
                style="max-width: 420px;"
                align="center"
                justify="center"
                cols="12"
                class="pa-0 ma-0 fill-height"
              >
                <amb-banner
                  v-if="isEdgeConnected"
                  banner-class="text-left"
                  icon="cloud-check-outline"
                  text="Ambianic Edge device connected!"
                />
                <amb-banner
                  v-else
                  banner-class="text-left"
                  icon="cloud-off-outline"
                  icon-color="info"
                  data-cy="edge-device-disconnected"
                  text="Ambianic Edge device disconnected."
                />
                <v-card
                  class="mx-auto text-left"
                  flat
                  v-if="isEdgeConnected"
                >
                  <v-list
                    two-line
                  >
                    <amb-list-item
                      ref="list-item-edgeDeviceName"
                      data-cy="list-item-edgeDeviceName"
                      :title="edgeDisplayName"
                      subtitle="Display Name"
                      icon-name="tag"
                      :edit-option="true"
                      :on-submit="onDisplayNameChanged"
                      :rules="[rules.required, rules.counter]"
                    />
                    <v-divider inset />
                    <amb-list-item
                      :title="edgePeerId"
                      subtitle="Peer ID"
                      icon-name="identifier"
                      :sensitive-field="true"
                      :copy-option="true"
                      ref="list-item-edgePeerID"
                      data-cy="list-item-edgePeerID"
                    />
                    <amb-list-item
                      ref="list-item-edgeVersion"
                      :title="edgeVersion"
                      id="version-element"
                      subtitle="Edge Software Version"
                      icon-name="alpha-v-circle-outline"
                      data-cy="list-item-edgeVersion"
                    />
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </amb-app-frame>
</template>
<script>
import { mapState } from 'vuex'
import {
  PEER_CONNECTED,
  PEER_CONNECTION_ERROR,
  EDGE_DEVICE_DETAILS,
  EDGE_DEVICE_DISPLAY_NAME
} from '@/store/mutation-types'

export default {
  components: {
    AmbBanner: () => import('@/components/shared/Banner.vue'),
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  data () {
    return {
      edgeAddress: undefined,
      edgeDeviceError: null,
      syncing: false, // is the UI in the process of syncing with remote device data
      rules: {
        required: value => !!value || 'Required.',
        counter: value => (value.length >= 5 && value.length <= 20) || 'Min 5 and Max 20 characters'
      }
    }
  },
  created () {
    // if a connection to the edge device is already established
    // but version info has not been fetched yet, let's do it now
    if (this.isEdgeConnected && !this.edgeVersion) {
      this.fetchEdgeDetails()
    }
  },
  mounted () {
  },
  methods: {
    async fetchEdgeDetails () {
      try {
        const details = await this.pnp.edgeAPI.getEdgeStatus()
        console.debug('Edge device details fetched:', { details })
        if (!details || !details.version) {
          this.edgeDeviceError = 'Edge device requires update.'
        } else {
          this.$store.commit(EDGE_DEVICE_DETAILS, details)
        }
      } catch (e) {
        this.edgeDeviceError = 'Edge device API offline or unreachable.'
      }
    },
    async onDisplayNameChanged (newDisplayName) {
      console.debug(`newDisplayName: ${newDisplayName}`)
      let updated = false
      if (newDisplayName) {
        try {
          console.debug(`New device display name: ${newDisplayName}`)
          // trigger edit change callback
          //    show blocking dialog with spinner https://vuetifyjs.com/en/components/dialogs/#loader
          //    await dispatch to push new device display name: 1. to device, 2. to local device store
          this.syncing = true
          await this.pnp.edgeAPI.setDeviceDisplayName(newDisplayName)
          this.$store.commit(EDGE_DEVICE_DISPLAY_NAME, newDisplayName)
          updated = true
        } catch (e) {
          this.edgeDeviceError = 'Error updating display name. Edge device offline or has outdated API.'
          console.error('Exception calling setDeviceDisplayName()', { e })
        } finally {
          this.syncing = false
        }
      }
      return updated
    }
  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      isPeerConnectionError: state => state.pnp.peerConnectionStatus === PEER_CONNECTION_ERROR,
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      edgeVersion: state => state.edgeDevice.edgeSoftwareVersion,
      edgeDisplayName: state => {
        const deviceLabel = (state.edgeDevice.edgeDisplayName) ? state.edgeDevice.edgeDisplayName : 'My Ambianic Edge Device'
        return deviceLabel
      }
    })
  },
  watch: {
    isEdgeConnected: async function (isConnected) {
      if (isConnected) {
        await this.fetchEdgeDetails()
      }
    },
    isPeerConnectionError: async function (isError) {
      console.debug('watch peerConnectionError triggered. New value', { isError })
      if (isError) {
        this.edgeDeviceError = this.$store.state.pnp.userMessage
        console.debug('isPeerConnectionError TRUE. Error message:', this.edgeDeviceError)
      } else {
        // clear the user friendly error message
        this.edgeDeviceError = undefined
        console.debug('isPeerConnectionError FALSE. Error message:', this.edgeDeviceError)
      }
    }
  }
}
</script>
