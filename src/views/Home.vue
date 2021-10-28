<template>
  <v-main class="body">
    <v-container
      id="container"
      fluid
    >
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-card
          max-width="344"
          class="mx-auto"
        >
          <v-list-item
            align="center"
            justify="center"
          >
            <v-list-item-content>
              <v-list-item-title
                class="headline"
                ref="headline-title"
              >
                Welcome to Ambianic.ai
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text
            id="welcome-text"
            class="text-center"
          >
            <v-avatar
              rounded
              size="200"
            >
              <v-img
                v-if="this.$vuetify.theme.dark"
                src="@/assets/home-screen-logo-dark.png"
                ref="logo-image"
              />
              <v-img
                v-else
                src="@/assets/home-screen-logo-light.png"
                ref="logo-image"
              />
            </v-avatar>
            <p />
            <v-list-item-subtitle class="center">
              Safer Home via Ambient Intelligence.
            </v-list-item-subtitle>
            <v-list-item-subtitle class="center">
              Privacy Preserving. Decentralized.
            </v-list-item-subtitle>
          </v-card-text>

          <v-card-actions class="align-center">
            <div
              class="skip-link"
            >
              <v-btn
                rounded
                color="pink darken-4"
                dark
                data-cy="button-beginSetup"
                class="ma-2 white--text"
                to="onboarding"
                id="btn-setup"
                ref="btn-setup"
                v-if="!hasSetupSystem"
              >
                Begin Setup
                <v-icon right>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
              <v-btn
                rounded
                color="pink darken-4"
                dark
                data-cy="continue"
                class="ma-2 white--text"
                to="settings"
                id="btn-dashboard"
                ref="btn-continue"
                v-else
              >
                Continue
                <v-icon right>
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { STORAGE_KEY } from '@/store/pnp'
export default {
  name: 'Home',
  data () {
    return {
      hasSetupSystem: false
    }
  },
  created () {
    const setupStatus = window.localStorage.getItem('hasCompletedOnboarding')
    // Accessing directly to minimize load time to meet Lighthouse performance benchmark.
    // When using vuex store, the dependencies push above the lighthouse PWA response time budget.
    const remotePeerId = window.localStorage.getItem(`${STORAGE_KEY}.remotePeerId`)

    // If the user has already setup an edge device connection
    // via recent version of the app or
    // an edge device was setup via an earlier app version
    // then this app is not a new install.
    if (setupStatus || remotePeerId) {
      this.hasSetupSystem = true
    }
  }
}
</script>

<style lang="css" scoped>
.center {
  text-align : center;
}
.align-center {
  display : flex;
  justify-content : center;
  align-content  :center;
}
.body {
  display: flex;
  justify-content: center;
  align-items : center;
  width : 100%;
  height: 100vh;
}
</style>
