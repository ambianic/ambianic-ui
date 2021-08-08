<template>
  <amb-app-frame>
    <v-row
      align="start"
      justify="center"
      align-content="space-around"
    >
      <template>
        <v-card
          max-width="344"
        >
          <v-layout
            column
            wrap
            align-start
          >
            <amb-list-item
              id="about-title"
              title="Safer Home"
              subtitle="via Ambient Intelligence"
            />
          </v-layout>

          <v-img
            max-width="300"
            class="mx-auto"
            src="@/assets/home-screen-logo.png"
          />

          <v-card-text id="about-info">
            Review your home timeline for notable moments.
            Configure input sensors and camers for Ambianic to observe.
            Share, purge or backup your data
            - it never slips out of your control.
          </v-card-text>

          <v-layout
            column
            wrap
            align-center
          >
            <v-flex>
              <amb-list-item
                id="version-info"
                :title="version"
                icon-name="alpha-v-circle-outline"
                subtitle="Release Version"
              />
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-btn
              text
              color="info"
              :to="'timeline'"
              id="btn-timeline"
            >
              View Timeline
            </v-btn>
            <v-spacer />
            <v-btn
              text
              color="info"
              :to="'settings'"
              id="btn-settings"
            >
              Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-row>
  </amb-app-frame>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    AmbListItem: () => import('@/components/shared/ListItem.vue'),
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  },
  computed: {
    ...mapState({
      version: state => state.version
    })
  }
}
</script>
