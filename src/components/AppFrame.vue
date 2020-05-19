<!-- App.vue -->
<template>
  <v-app>
    <!-- nav goes here -->
    <NavBar />

    <v-content>
      <v-container
        id="container"
        class="pa-0 ma-0"
        fluid
      >
        <slot>
          <p>App page content goes here...</p>
        </slot>
      </v-container>
    </v-content>

    <v-footer
      app
      inset
    >
      <update-notification class="mx-auto" />
    </v-footer>
  </v-app>
</template>

<script>
import NavBar from './NavBar.vue'

export default {
  name: 'AppFrame',
  components: {
    UpdateNotification: () => import('./UpdateNotification'), NavBar
  },
  data: () => ({
    // ...
  })
}
</script>
