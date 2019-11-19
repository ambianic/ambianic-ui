<template>
  <app-frame>
    <v-row
      align="center"
      justify="center"
    >
      <v-card>
        <v-card-title class="grey darken-2">
          Settings
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
                <v-text-field
                  prepend-icon="mdi-web"
                  placeholder="Ambianic Edge Device IP Address (e.g. 192.168.68.31) or host name (e.g. ambianic-edge.lan)"
                  v-model="settingsForm.address"
                />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
          >
            Test Connection
          </v-btn>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </app-frame>
</template>
<script>
import AppFrame from '@/components/AppFrame.vue'
import { settingsDB } from '@/store/db'

export default {
  data () {
    return {
      settingsForm: {
        address: ''
      }
    }
  },
  components: {
    AppFrame
  },
  mounted () {
    this.loadSettings()
  },
  methods: {
    loadSettings () {
      settingsDB.get('ambanic-edge-address').then(
        (address) => {
          this.settingsForm.address = address
        }
      )
    },
    saveSettings () {
      settingsDB.set('ambanic-edge-address', this.settingsForm.address)
    },
    cancel () {
      // load previously saved settings
      this.loadSettings()
    },
    save () {
      // load previously saved settings
      this.saveSettings()
    }
  }
}

</script>
