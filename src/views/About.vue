<template>
  <app-frame>
    <v-row
      align="center"
      justify="center"
    >
      <v-tooltip right>
        <template>
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
              height="194"
            />

            <v-card-text>
              Ambianic's mission is to make your home a little cozier.
              Review your home timeline for notable moments. Configure input sensors and
              camers for Ambianic to observe.
              Share, purge
              or backup your data - it never slips out of your control.
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
      </v-tooltip>
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
