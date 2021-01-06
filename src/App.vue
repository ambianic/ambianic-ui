<!-- App.vue -->
<template>
  <v-lazy>
    <amb-app-frame v-if="$route.name !== 'home'">
      <vue-page-transition name="fade-in-right">
        <router-view />
      </vue-page-transition>
    </amb-app-frame>

    <v-app v-else>
      <vue-page-transition name="fade-in-right">
        <router-view />
      </vue-page-transition>
    </v-app>
  </v-lazy>
</template>

<script>
import AmbAppFrame from '@/components/AppFrame.vue'
export default {
  name: 'App',
  components: {
    AmbAppFrame
  }
}
</script>

<style scoped>
.theme--light.v-application {
  background: rgb(65, 131, 194) !important;
  background: linear-gradient(
    180deg,
    rgb(49, 30, 102) 0%,
    rgb(94, 48, 99) 100%
  );
}
</style>
