<!-- App.vue -->
<template>
  <v-app>
    <AppFrame v-if="!$route.meta.isHome">
      <router-view />
    </AppFrame>
    <router-view v-else />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    AppFrame: () => import('./components/AppFrame.vue')
  }
}
</script>
