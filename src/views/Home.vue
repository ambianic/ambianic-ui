<template>
  <v-app>
    <v-content>
      <v-container
        id="container"
        class="pa-0 ma-0"
        fluid
      >
        <v-row
          align="center"
          justify="center"
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
                  Cozier Home and Workspace
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
      </v-container>
    </v-content>
  </v-app>
</template>
