<template>
  <app-frame>
    <v-row
      align="center"
      justify="center"
    >
      <template>
        <v-card
          max-width="344"
        >
          <v-card-title>
            <!-- refactored list 1 -->
            <ListItem
              title="Cozy at Home"
              subtitle="via Ambient Intelligence"
            />
          </v-card-title>

          <v-img
            max-width="300"
            class="mx-auto"
            src="@/assets/home-screen-logo.png"
          />

          <v-card-text>
            {{ subheader }}
          </v-card-text>

          <v-layout
            column
            wrap
            align-center
          >
            <v-flex>
              <list-item
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
import { mapState } from 'vuex'
const AppFrame = () => import('@/components/AppFrame.vue')
const ListItem = () => import('../components/shared/ListItem.vue')

export default {
  components: {
    AppFrame, ListItem
  },
  data: () => ({
    subheader: `
      Review your home timeline for notable moments.
      Configure input sensors and camers for Ambianic to observe.
      Share, purge or backup your data
      - it never slips out of your control.
      `
  }),
  computed: {
    ...mapState({
      version: state => state.version
    })
  }
}

</script>
