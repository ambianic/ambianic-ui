<template>
  <v-container
    class="pa-0 ma-0"
    data-cy="container"
    fluid
  >
    <v-app-bar
      color="blue darken-3"
    >
      <div class="navbar">
        <v-toolbar-title
          style="width: 300px"
          class="ml-10 pl-4"
        >
          <v-app-bar-nav-icon
            id="drawer"
            @click.stop="drawer = !drawer"
          />
          <span class="hidden-sm-and-down">Ambianic</span>
        </v-toolbar-title>

        <div right>
          <nav-button
            right
            data-cy="timeline-icon"
            icon="history"
            style="text-align: right;"
            to="timeline"
          />

          <nav-button
            data-cy="download-off"
            icon="download-off"
            color="warning"
            v-if="!isEdgeConnected"
            to="edge-connect"
          />

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
        </div>
      </div>
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
        <template
          v-for="item in items"
        >
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
import {
  PEER_CONNECTED
} from '@/store/mutation-types'

export default {
  name: 'NavBar',
  components: {
    NavButton: () => import('./shared/Button.vue')
  },
  data: () => ({
    dialog: false,
    drawer: null, // hide drawer on mobile and show on desktop
    on: true,
    newFavorites: 0,
    newAlerts: 2,
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
.navbar {
   width: 100%;
   display: flex;
   flex : 1;
   justify-content: space-between;
}
</style>
