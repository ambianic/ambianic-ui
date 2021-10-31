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
          <v-card-title ref="help-title">
            <v-icon
              large
              left
            >
              mdi-help-circle-outline
            </v-icon>
            <span>Need Help with Ambianic?</span>
          </v-card-title>
          <v-card-text>
            <span>
              Please reference our online docs and forum discussions for common issues. You can also chat with us on Slack.
            </span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              id="btn-docs"
              ref="btn-docs"
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
              <span>Docs</span>
            </v-btn>
            <v-btn
              id="btn-forum"
              ref="btn-forum"
              text
              href="https://github.com/ambianic/ambianic-ui/discussions"
              target="_blank"
            >
              <v-icon
                left
                dark
              >
                mdi-forum
              </v-icon>
              <span>Forum</span>
            </v-btn>
            <v-btn
              id="btn-community"
              text
              href="https://join.slack.com/t/ambianicai/shared_invite/zt-eosk4tv5-~GR3Sm7ccGbv1R7IEpk7OQ"
              target="_blank"
            >
              <v-icon
                left
                dark
              >
                mdi-slack
              </v-icon>
              <span>Slack</span>
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
    AmbAppFrame: () => import('@/components/AppFrame.vue')
  }
}
</script>
