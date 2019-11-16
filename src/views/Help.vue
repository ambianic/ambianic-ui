<template>
  <app-frame>
    <v-row
      align="center"
      justify="center"
    >
      <div class="about">
        <strong>Help page content goes here...</strong>
      </div>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            href="https://github.com/ambianic"
            icon
            large
            target="_blank"
            v-on="on"
          >
            <v-icon large>
              mdi-code-tags
            </v-icon>
          </v-btn>
        </template>
        <span>Source</span>
      </v-tooltip>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            large
            href="https://codepen.io/johnjleider/pen/MNYLdL"
            target="_blank"
            v-on="on"
          >
            <v-icon large>
              mdi-codepen
            </v-icon>
          </v-btn>
        </template>
        <span>Codepen</span>
      </v-tooltip>
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
