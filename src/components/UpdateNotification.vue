<template>
  <v-alert
    v-if="updateToBeInstalled"
    dense
    type="info"
  >
    <v-row align="center">
      <v-col class="grow">
        A new version is available
      </v-col>
      <v-col class="shrink">
        <v-btn @click="refresh">
          refresh
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UpdateNotification',
  computed: {
    ...mapState({
      updateToBeInstalled: state => state.updateToBeInstalled
    })
  },
  methods: {
    refresh () {
      this.updateToBeInstalled.postMessage(
        { type: 'SKIP_WAITING' }
      )
      window.location.reload()
    }
  }
}
</script>

<style scoped>

</style>
