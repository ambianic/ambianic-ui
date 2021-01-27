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

</style>
