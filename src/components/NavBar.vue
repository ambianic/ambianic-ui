<template>
  <v-container
    class="pa-0 ma-0"
    data-cy="container"
    fluid
  >
    <v-app-bar
      app
      color="blue darken-3"
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon
          id="drawer"
          @click.stop="drawer = !drawer"
        />
        <span class="hidden-sm-and-down">Ambianic</span>
      </v-toolbar-title>
      <v-spacer />

      <nav-button
        data-cy="timeline-icon"
        icon="history"
        to="timeline"
      />

      <div>
        <v-tooltip bottom>
          <template
            v-if="!isEdgeConnected"
            #activator="{ on : navBtn, attrs }"
          >
            <div
              v-bind="attrs"
              v-on="navBtn"
            >
              <nav-button
                :id="connectionStatusIcon"
                data-cy="connection-status"
                :icon="connectionStatusIcon"
                :color="connectionIconColor"
                to="edge-connect"
                v-bind="attrs"
                v-on="on"
              />
            </div>
          </template>
          <span>{{ connectionStatusTooltipText }}</span>
        </v-tooltip>
      </div>

      <!-- Future navbar icons
      <v-text-field
        id="searchbar"
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      />
      <v-spacer />
      <nav-button
        with-badge
        data-cy="heart"
        icon="heart"
        :badge-content="newFavorites"
        :badge-value="newFavorites"
      />
      <nav-button
        with-badge
        data-cy="bell"
        icon="bell"
        :badge-content="newAlerts"
        :badge-value="newAlerts"
      />
      -->

      <nav-button
        data-cy="about"
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
      </nav-button>
    </v-app-bar>

    <!-- drawer -->
    <v-navigation-drawer
      v-model="drawer"
      data-cy="drawer"
      app
      mini-variant
      expand-on-hover
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
            :class="item.class"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
            :class="item.class"
          >
            <template #activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon color="primary">
                  {{ child.icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="item.link"
            :class="item.class"
          >
            <v-list-item-action>
              <v-icon :color="item.color">
                {{ item.icon }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { PEER_CONNECTED } from '@/store/mutation-types'
import { PEER_DISCOVER } from '../store/action-types'
export default {
  name: 'NavBar',
  components: {
    NavButton: () => import('./shared/Button.vue')
  },
  data: () => ({
    connectionStatusIcon: 'cloud-off-outline',
    dialog: false,
    drawer: null, // hide drawer on mobile and show on desktop
    on: true,
    connectionStatusTooltipText: 'Disconnected',
    newFavorites: 0,
    newAlerts: 2,
    connectionIconColor: 'warning',
    logo: '../assets/logo5.svg',
    items: [
      { icon: 'history', text: 'Timeline', link: '/timeline' },
      // { icon: 'mdi-account-heart-outline', text: 'People', link: '/people' },
      // class: 'hidden-sm-and-down' ensures that an item is not shown
      // on small screens. For example flows are only visible on screens with
      // enough space for a smooth user experience.
      // { icon: 'mdi-pipe', text: 'Flows', link: '/flows' },
      // {
      //  icon: 'keyboard_arrow_up',
      //  'icon-alt': 'keyboard_arrow_down',
      //  text: 'Labels',
      //  model: true,
      //  children: [
      //    { icon: 'add', text: 'Create label' }
      //  ]
      // },
      // {
      //  icon: 'keyboard_arrow_up',
      //  'icon-alt': 'keyboard_arrow_down',
      //  text: 'More',
      //  model: false,
      //  children: [
      //    { text: 'Sources' },
      //    { text: 'Components' },
      //    { text: 'Integrations' }
      //  ]
      // },
      // { icon: 'mdi-video-input-antenna', text: 'Connect', link: '/edge-connect' },
      // { icon: 'mdi-video-input-antenna', text: 'Connect Remote', link: '/remote-edge-connection' },
      { icon: 'settings', text: 'Settings', link: '/settings' },
      { icon: 'chat_bubble', text: 'Send feedback', link: '/feedback' },
      { icon: 'help', text: 'Help', link: '/help' },
      { icon: 'info', text: 'About Ambianic', link: '/about' }
    ]
  }),
  methods: {
    setConnectionTooltipText () {
      if (this.peerConnectionStatus === 'PEER_DISCONNECTED') {
        this.connectionStatusTooltipText = 'Disconnected'
        this.connectionStatusIcon = 'cloud-off-outline'
        this.connectionIconColor = 'warning'
      } else if (this.peerConnectionStatus === 'PEER_CONNECTING') {
        this.connectionStatusIcon = 'cloud-sync-outline'
        this.connectionIconColor = 'info'
        this.connectionStatusTooltipText = 'Connecting ...'
      }
    }
  },
  computed: {
    ...mapState({
      isEdgeConnected: function (state) {
        console.debug(
          `app frame: state.pnp.peerConnectionStatus: ${state.pnp.peerConnectionStatus}`
        )
        const isConnected = state.pnp.peerConnectionStatus === PEER_CONNECTED
        return isConnected
      },
      peerConnectionStatus: state => state.pnp.peerConnectionStatus
    })
  },
  created () {
    if (!this.isEdgeConnected) {
      this.$store.dispatch(PEER_DISCOVER)
    }

    this.setConnectionTooltipText()
  },
  watch: {
    peerConnectionStatus: function () {
      this.setConnectionTooltipText()
    }
  }
}
</script>
