<template>
  <amb-app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
      <v-col
        style="max-width: 400px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-card
          class="mx-auto text-left"
        >
          <v-list
            three-line
          >
            <amb-list-item
              id="help-title"
              icon-name="help-circle-outline"
              title="Need Help with Ambianic?"
              subtitle="Please reference our online docs or connect on Twitter."
            />
          </v-list>
          <v-card-actions>
            <v-btn
              id="btn-docs"
              text
              href="https://docs.ambianic.ai"
              target="_blank"
            >
              <v-icon
                left
                dark
              >
                mdi-file-document-box-check-outline
              </v-icon>
              Documentation
            </v-btn>
            <v-btn
              id="btn-community"
              text
              href="https://twitter.com/ambianicai"
              target="_blank"
            >
              <v-icon
                left
                dark
              >
                mdi-twitter
              </v-icon>
              Twitter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </amb-app-frame>
</template>
<script>

export default {
  components: {
    AmbListItem: () => import('@/components/shared/ListItem.vue'),
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  }
}
</script>
