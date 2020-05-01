<template>
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
        <v-list
          three-line
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon large>
                mdi-help-circle-outline
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Neeed Help with Ambianic?</v-list-item-title>
              <v-list-item-subtitle>Please reference our online documentaion.</v-list-item-subtitle>
              <v-list-item-subtitle>Or engage our active and growing community on Twitter.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn
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
</template>

<script>
export default {

}
</script>
