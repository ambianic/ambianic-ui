<template>
  <app-frame>
    <v-row
      align="center"
      justify="center"
    >
      <v-card>
        <v-card-title class="grey darken-2">
          Add Person
        </v-card-title>
        <v-container grid-list-sm>
          <v-layout
            row
            wrap
          >
            <v-flex
              xs12
              align-center
              justify-space-between
            >
              <v-layout align-center>
                <v-avatar
                  size="40px"
                  class="mr-3"
                >
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                />
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              />
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
          >
            More
          </v-btn>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </app-frame>
</template>
<script>
const AppFrame = () => import('@/components/AppFrame.vue')

export default {
  components: {
    AppFrame
  }
}

</script>
