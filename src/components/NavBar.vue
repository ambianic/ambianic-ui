<template>
  <v-flex>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Ambianic</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      />
      <v-spacer />

      <amb-button
        with-badge
        is-icon
        icon="download-off"
        v-if="!isEdgeConnected"
        @click="$router.push('edge-connect')"
      />

      <!-- test -->
      <amb-button
        with-badge
        is-icon
        icon="heart"
        :badge-content="newFavorites"
        :badge-value="newFavorites"
      />

      <amb-button
        with-badge
        is-icon
        icon="bell"
        :badge-content="newAlerts"
        :badge-value="newAlerts"
      />

      <amb-button
        is-icon
        to="about"
      >
        <v-avatar
          size="32px"
          item
        >
          <v-img
            src="@/assets/logo5.svg"
            alt="Ambianic.ai logo"
          />
        </v-avatar>
      </amb-button>
    </v-app-bar>

    <!-- drawer -->
    <Drawer :drawer="drawer" />
  </v-flex>
</template>

<script>
import Drawer from './Drawer.vue'
import { mapState } from 'vuex'
import {
  PEER_CONNECTED
} from '@/store/mutation-types'

export default {
  name: 'NavBar',
  components: {
    AmbButton: () => import('./shared/Button.vue'), Drawer
  },
  data: () => ({
    dialog: false,
    drawer: true,
    on: true,
    newFavorites: 0,
    newAlerts: 2,
    logo: '../assets/logo5.svg'
  }),
  computed: {
    ...mapState({
      isEdgeConnected: function (state) {
        console.debug(`app frame: state.pnp.peerConnectionStatus: ${state.pnp.peerConnectionStatus}`)
        return state.pnp.peerConnectionStatus === PEER_CONNECTED
      }
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
