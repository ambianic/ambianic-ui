<template>
  <v-content>
    <v-container
      id="container"
      class="pa-0 ma-0"
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
              <v-list-item-subtitle>
                Cozy at Home via Ambient Intelligence
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            src="@/assets/home-screen-logo.png"
          />

          <v-card-text id="welcome-text">
            Ambianic.ai enables you to see your home
            as a timeline of important events.
            You can configure camers and sensors as ambient observation sources.
            Share, purge or backup your data
            - it never slips out of your control.
          </v-card-text>

          <v-card-text id="welcome-text">
            Now let's setup your Ambianic.ai system.
          </v-card-text>

          <v-card-actions>
            <v-btn
              id="btn-settings"
              rounded
              color="pink darken-4"
              dark
              class="ma-2 white--text"
              :to="'settings'"
            >
              Continue
              <v-icon
                right
              >
                mdi-chevron-right
              </v-icon>
            </v-btn>
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
  </v-content>
</template>

<script>
import UpdateNotification from '../components/UpdateNotification'
import { mapGetters, mapActions } from 'vuex'
import {
  USER_VISIT
} from '@/store/action-types'

export default {
  name: 'Home',
  components: {
    UpdateNotification
  },
  computed: {
    ...mapGetters([
      'isFirstTimeUser'
    ])
  },
  methods: {
    ...mapActions({
      userVisit: USER_VISIT
    })
  },
  created () {
    const firstVisit = this.isFirstTimeUser
    console.debug({ firstVisit }) // eslint-disable-line no-console
    console.debug('dispatch user visiting app')
    this.userVisit()
    if (!firstVisit) {
      this.$router.replace({ name: 'timeline' })
    }
  }

}
</script>
