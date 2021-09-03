<!-- AppFrame.vue -->
<template>
  <div>
    <!-- nav goes here -->
    <NavBar />
    <StatusSnackbar />

    <v-main>
      <v-container
        id="container"
        class="pa-0 ma-0"
        fluid
      >
        <slot>
          <p>App page content goes here...</p>
        </slot>
      </v-container>
    </v-main>

    <v-footer
      app
      inset
    >
      <update-notification class="mx-auto" />
    </v-footer>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import StatusSnackbar from '@/components/shared/snackNotification'

export default {
  name: 'AppFrame',
  components: {
    UpdateNotification: () => import('./UpdateNotification'), NavBar, StatusSnackbar
  },
  data: () => ({
    dialog: false,
    drawer: null,
    newFavorites: 0,
    newAlerts: 2,
    on: true,
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
      { icon: 'mdi-video-input-antenna', text: 'Connect', link: '/choose-edge-connection' },
      { icon: 'mdi-video-input-antenna', text: 'Connect Remote', link: '/remote-edge-connection' },
      // { icon: 'settings', text: 'Settings', link: '/settings' },
      { icon: 'chat_bubble', text: 'Send feedback', link: '/feedback' },
      { icon: 'help', text: 'Help', link: '/help' },
      { icon: 'info', text: 'About Ambianic', link: '/about' }
    ]
  })
  // computed: {
  //   ...mapState({
  //     isEdgeConnected: function (state) {
  //       console.debug(`app frame: state.pnp.peerConnectionStatus: ${state.pnp.peerConnectionStatus}`)
  //       return state.pnp.peerConnectionStatus === PEER_CONNECTED
  //     }
  //   })
  // }
}
</script>
