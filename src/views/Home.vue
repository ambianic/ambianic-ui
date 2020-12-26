<template>
  <div class="body">
    <div class="container">
      <v-card
        max-width="400"
        class="mx-auto"
      >
        <v-list-item
          align="center"
          justify="center"
        >
          <v-list-item-content>
            <v-list-item-title class="headline">
              Welcome to Ambianic.ai
            </v-list-item-title>

            <v-list-item-subtitle>
              Cozy at Home - via Ambient Intelligence
            </v-list-item-subtitle>

            <v-card-text id="welcome-text">
              <p v-if="!hasSetupSystem">
                Let's setup your system
              </p>
              <p v-else>
                Control your Ambianic Edge Appliances from your console.
              </p>
            </v-card-text>

            <div v-if="hasSetupSystem">
              <v-btn
                rounded
                color="pink darken-4"
                dark
                data-cy="timeline"
                class="ma-2 white--text"
                :to="'timeline'"
                id="btn-timeline"
              >
                Open Edge Console
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                rounded
                color="pink darken-4"
                dark
                data-cy="timeline"
                class="ma-2 white--text"
                :to="'onboarding'"
                id="btn-timeline"
              >
                Continue Setup
                <v-icon right>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return { hasSetupSystem: false }
  },
  created () {
    const setupStatus = window.localStorage.getItem('hasCompletedOnboarding')

    if (setupStatus) {
      this.hasSetupSystem = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.see-thru {
  opacity: 0.8
}

.container {
    width : 100%;
}

.body {
    display: flex;
    justify-content center;
    align-items : center;
    width : 100%;
    background: rgba(233, 241, 251, 0.81);
    height: 100vh;
}
</style>
