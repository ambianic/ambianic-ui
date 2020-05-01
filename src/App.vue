<!-- App.vue -->
<template>
  <v-app>
    <keep-alive>
      <AppFrame v-if="!$route.meta.isHome">
        <router-view />
      </AppFrame>
      <router-view v-else />
    </keep-alive>
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
