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
              <v-list-item-title class="headline">
                Welcome to Ambianic.ai
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-img src="@/assets/home-screen-logo.png" />

          <v-card-text id="welcome-text">
            <v-list-item-subtitle class="center">
              Safe Home - via Ambient Intelligence
            </v-list-item-subtitle>

            <p
              class="center"
              v-if="!hasSetupSystem"
            >
              Let's setup your system
            </p>
            <p
              class="center"
              v-else
            >
              Control your Ambianic Edge Appliances from your console.
            </p>
          </v-card-text>

          <v-card-actions class="align-center">
            <div
              class="skip-link"
            >
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
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row
        align="end"
        justify="center"
        no-gutters=""
      >
        <v-col>
          <update-notification class="mx-auto" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapState } from 'vuex'

import UpdateNotification from '@/components/UpdateNotification'

export default {
  name: 'Home',
  components: {
    UpdateNotification
  },
  computed: {
    ...mapState({
      edgePeerId: state => state.pnp.remotePeerId
    })
  },
  data () {
    return { hasSetupSystem: false }
  },
  created () {
    const setupStatus = window.localStorage.getItem('hasCompletedOnboarding')
    const remotePeerId = this.edgePeerId

    if (setupStatus || remotePeerId) {
      this.$router.push('timeline')
    }
  }
}
</script>

<style lang="stylus" scoped>
.see-thru {
  opacity: 0.8
}

.center {
  text-align : center;
}
.container {
    width : 100%;
}
  .flex-between {
    display : flex;
    justify-content : space-between;
  }
.invisible {
  opacity : 0;
}

.align-center {
  display : flex;
  justify-content : center;
  align-content  :center;
}

.body {
  display: flex;
  background: rgba(233, 241, 251, 0.81);
  justify-content center;
  align-items : center;
  width : 100%;
  height: 100vh;
}
.text {
  font-display : swap
}
.skip-link {
  left: 0;
  color: white;
  padding: 0px;
  z-index: 50;
}
.skip-link:focus {
  top: 0;
}
</style>
