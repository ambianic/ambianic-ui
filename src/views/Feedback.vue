<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
      <v-col
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-card
          class="mx-auto text-left"
        >
          <v-list three-line
          >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon large>mdi-comment-quote-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Send Feedback</v-list-item-title>
                  <v-list-item-subtitle>We currently use github to gather user feedbaack.</v-list-item-subtitle>
                  <v-list-item-subtitle>Your time is greatly appreciated!</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn
              text
              href="https://github.com/ambianic/ambianic-ui/issues"
              target="_blank"
              >Open Feedback Page
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
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
