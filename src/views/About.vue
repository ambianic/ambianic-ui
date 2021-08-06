<template>
  <v-row
    align="start"
    justify="center"
    align-content="space-around"
  >
    <template>
      <v-card max-width="344">
        <v-layout
          column
          wrap
          align-start
        >
          <amb-list-item
            id="about-title"
            title="Safe Home"
            subtitle="via Ambient Intelligence"
          />
        </v-layout>

        <v-img
          max-width="300"
          class="mx-auto"
          src="@/assets/home-screen-logo.png"
        />

        <v-card-text id="about-info">
          Review your home timeline for notable moments. Configure input sensors
          and cameras for Ambianic to observe. Share, purge or backup your data -
          it never slips out of your control.
        </v-card-text>

        <v-layout
          column
          wrap
          align-center
        >
          <v-flex>
            <amb-list-item
              id="version-element"
              :title="version"
              icon-name="alpha-v-circle-outline"
              subtitle="Release Version"
            />
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-btn
            text
            color="info"
            :to="'timeline'"
            id="btn-timeline"
          >
            View Timeline
          </v-btn>
          <v-spacer />
          <v-btn
            text
            color="info"
            :to="'settings'"
            id="btn-settings"
          >
            Settings
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-row>
</template>
<script>
import AmbListItem from '@/components/shared/ListItem.vue'
import { PEER_CONNECTED } from '@/store/mutation-types'
import { mapState } from 'vuex'
import { FETCH_EDGE_DEVICE_DETAILS } from '../store/action-types'
import { EdgeAPI } from '../remote/edgeAPI'

export default {
  components: {
    AmbListItem
  },
  computed: {
    ...mapState({
      version: (state) => state.edgeDeviceStore.version,
      isEdgeConnected: (state) =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      pnp: state => state.pnp
    })
  },
  created () {
    this.edgeAPI = new EdgeAPI(this.pnp)

    if (this.isEdgeConnected) {
      this.fetchEdgeDetails()
    }
  },
  methods: {
    async fetchEdgeDetails () {
      try {
        const details = await this.edgeAPI.getEdgeStatus()

        await this.$store.dispatch(FETCH_EDGE_DEVICE_DETAILS, details)
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    isEdgeConnected: function (isConnected) {
      if (isConnected) {
        this.fetchEdgeDetails()
      }
    }
  }
}
</script>
