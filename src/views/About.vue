<template>
  <app-frame>
    <v-row
      align="start"
      justify="center"
      align-content="space-around"
    >
      <template>
        <v-card
          max-width="344"
        >
          <v-list-item
            align="center"
            justify="center"
          >
            <v-list-item-content>
              <v-list-item-title class="headline">
                News from Home
              </v-list-item-title>
              <v-list-item-subtitle>
                via Ambient Intelligence
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-img
            max-width="300"
            class="mx-auto"
            src="@/assets/home-screen-logo.png"
          />

          <v-card-text>
            Review your home timeline for notable moments.
            Configure input sensors and camers for Ambianic to observe.
            Share, purge or backup your data
             - it never slips out of your control.
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              color="info"
              :to="'timeline'"
            >
              View Timeline
            </v-btn>
            <v-spacer />
            <v-btn
              text
              color="info"
              :to="'settings'"
            >
              Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'

export default {
  components: {
    AppFrame
  }
}

</script>
