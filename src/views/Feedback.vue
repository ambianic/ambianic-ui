<template>
  <amb-app-frame
    ref="app-frame"
  >
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
          <v-card-title
            ref="feedback-title"
            data-cy="feedback-title"
          >
            <v-icon
              large
              left
            >
              mdi-comment-quote-outline
            </v-icon>
            <span>Send Feedback</span>
          </v-card-title>
          <v-card-text
            data-cy="feedback-text"
          >
            <span>
              Your feedback helps us focus. Share your thoughts on our community forum.
            </span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              id="btn-feedback"
              ref="btn-feedback"
              data-cy="btn-feedback"
              text
              href="https://github.com/ambianic/ambianic-ui/discussions/categories/feedback"
              target="_blank"
            >
              Feedback Forum
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
