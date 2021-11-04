<template>
  <v-container
    class="pa-0 ma-0"
    data-cy="container"
    fluid
  >
    <v-app-bar
      app
      hide-on-scroll
      scroll-target="#app-container"
      absolute
      dense
      flat
      ref="app-bar"
    >
      <v-app-bar-nav-icon
        id="drawer"
        ref="menu-btn"
        @click.stop="drawer = !drawer"
      />

      <v-app-bar-title
        class="text-center"
        ref="app-bar-title"
      >
        <span v-if="edgeDisplayName">{{ edgeDisplayName }}</span>
        <span
          v-if="edgeDisplayName"
          class="hidden-sm-and-down"
        > - </span>
        <span class="hidden-sm-and-down">{{ $route.meta.title }}</span>
      </v-app-bar-title>

      <v-spacer />

      <v-tooltip bottom>
        <template
          #activator="{ on: timelineBtnEvents, attrs: timelineBtnAttrs }"
        >
          <v-btn
            icon
            data-cy="timeline-btn"
            ref="timeline-btn"
            to="timeline"
            v-bind="timelineBtnAttrs"
            v-on="timelineBtnEvents"
          >
            <v-icon>history</v-icon>
          </v-btn>
        </template>
        <span>Event Timeline</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template
          #activator="{ on: connectionBtnEvents, attrs: connectionBtnAttrs }"
        >
          <v-btn
            v-bind="connectionBtnAttrs"
            v-on="connectionBtnEvents"
            icon
            data-cy="connection-status"
            ref="connection-status-btn"
            :color="connectionIconColor"
            :to="connectionIconLink"
          >
            <v-icon>mdi-{{ connectionStatusIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ connectionStatusTooltipText }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template
          #activator="{ on: settingsBtnEvents, attrs: settingsBtnAttrs }"
        >
          <v-btn
            v-bind="settingsBtnAttrs"
            v-on="settingsBtnEvents"
            icon
            data-cy="settings-btn"
            ref="settings-btn"
            to="settings"
          >
            <v-icon>settings</v-icon>
          </v-btn>
        </template>
        <span>Settings</span>
      </v-tooltip>
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
        <template v-for="item in menuItems">
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
export default {
  name: 'NavBar',
  data: () => ({
    connectionStatusIcon: 'cloud-off-outline',
    dialog: false,
    drawer: null, // hide drawer on mobile and show on desktop
    on: true,
    connectionStatusTooltipText: 'Disconnected',
    newFavorites: 0,
    newAlerts: 2,
    connectionIconColor: 'warning',
    connectionIconLink: '/settings',
    edgeDisplayName: '',
    menuItems: [
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
    setConnectionStatusTooltipText () {
      this.connectionIconLink = '/settings'
      this.connectionIconColor = 'info'

      if (this.peerConnectionStatus === 'PEER_DISCONNECTED') {
        this.connectionStatusTooltipText = 'Disconnected'
        this.connectionStatusIcon = 'cloud-off-outline'
        this.connectionIconColor = 'warning'
      } else if (this.peerConnectionStatus === 'PEER_CONNECTING') {
        this.connectionStatusIcon = 'cloud-sync-outline'
        this.connectionStatusTooltipText = 'Connecting ...'
      } else if (this.peerConnectionStatus === 'PEER_CONNECTED') {
        this.connectionStatusIcon = 'cloud-check-outline'
        this.connectionStatusTooltipText = 'Connected!'
      }
    }
  },
  computed: {
    ...mapState({
      isEdgeConnected: function (state) {
        console.debug(
          `app frame: state.pnp.peerConnectionStatus: ${state.pnp.peerConnectionStatus}`
        )
        return state.pnp.peerConnectionStatus === PEER_CONNECTED
      },
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      currentDeviceCard: state => state.myDevices.currentDeviceCard
    })
  },
  created () {
    this.setConnectionStatusTooltipText()
  },
  mounted () {
    this.edgeDisplayName = this.$store.state.myDevices.currentDeviceCard ? this.$store.state.myDevices.currentDeviceCard.displayName : ''
  },
  watch: {
    peerConnectionStatus: function () {
      this.setConnectionStatusTooltipText()
    },
    currentDeviceCard: async function (newVal, oldVal) {
      if (newVal) {
        console.debug('Current Edge Device Card changed:', { newVal, oldVal })
        this.edgeDisplayName = newVal.displayName
      } else {
        this.edgeDisplayName = ''
      }
    }
  }
}
</script>
