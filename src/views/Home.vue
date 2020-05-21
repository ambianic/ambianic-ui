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
                Cozy at Home
              </v-list-item-title>
              <v-list-item-subtitle>
                via Ambient Intelligence
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            src="@/assets/home-screen-logo.png"
          />

          <v-card-text id="welcome-text">
            Review your home timeline for notable moments.
            Configure input sensors and camers for Ambianic to observe.
            Share, purge or backup your data
            - it never slips out of your control.
          </v-card-text>

          <v-card-actions>
            <v-btn
              rounded
              color="pink darken-4"
              dark
              class="ma-2 white--text"
              :to="'timeline'"
              id="btn-timeline"
            >
              View Timeline
              <v-icon
                right
              >
                mdi-history
              </v-icon>
            </v-btn>
            <v-spacer />
            <v-btn
              id="btn-settings"
              rounded
              color="pink darken-4"
              dark
              class="ma-2 white--text"
              :to="'settings'"
            >
              Settings
              <v-icon
                right
              >
                mdi-settings
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

export default {
  name: 'Home',
  components: {
    UpdateNotification
  }
}
</script>
