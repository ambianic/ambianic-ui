<template>
  <amb-app-frame>
    <v-row
      align="start"
      justify="center"
    >
      <template>
        <v-card
          max-width="344"
        >
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
                data-cy="logo-image"
              />
              <v-img
                v-else
                src="@/assets/home-screen-logo-light.png"
                ref="logo-image"
                data-cy="logo-image"
              />
            </v-avatar>
            <p />
            <v-list-item-subtitle
              class="center"
              data-cy="subtitle-one"
            >
              Safer Home via Ambient Intelligence.
            </v-list-item-subtitle>
            <v-list-item-subtitle
              class="center"
              data-cy="subtitle-two"
            >
              Privacy Preserving. Decentralized.
            </v-list-item-subtitle>
          </v-card-text>

          <v-layout
            column
            wrap
            align-center
          >
            <v-flex>
              <amb-list-item
                ref="version-info"
                data-cy="version-info"
                id="version-info"
                :title="version"
                icon-name="alpha-v-circle-outline"
                subtitle="UI App Version"
              />
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-btn
              text
              color="info"
              :to="'timeline'"
              id="btn-timeline"
              data-cy="btn-timeline"
            >
              Timeline
            </v-btn>
            <v-spacer />
            <v-btn
              text
              color="info"
              :to="'settings'"
              id="btn-settings"
              data-cy="btn-timeline"
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
      version: (state) => state.uiAppVersion
    })
  }
}
</script>
