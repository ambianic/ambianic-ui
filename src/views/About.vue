<template>
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
            title="Cozy at Home"
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
            outlined
            color="info"
            :to="'timeline'"
            id="btn-timeline"
          >
            View Timeline
          </v-btn>
          <v-spacer />
          <v-btn
            outlined
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
</template>
<script>
import AmbListItem from '@/components/shared/ListItem.vue'
import { mapState } from 'vuex'

export default {
  components: {
    AmbListItem
  },
  computed: {
    ...mapState({
      version: state => state.version
    })
  }
}

</script>
