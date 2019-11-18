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
            <v-flex xs12>
              <v-text-field
                prepend-icon="mdi-shield-key"
                placeholder="API Key (e.g. 234SDwersd235efedde)"
                v-model="settingsForm.apiKey"
              />
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
import { openDB } from 'idb'

const dbPromise = openDB('keyval-store', 1, {
  upgrade (db) {
    db.createObjectStore('settings')
  }
})

const settingsDB = {
  async get (key) {
    return (await dbPromise).get('settings', key)
  },
  async set (key, val) {
    return (await dbPromise).put('settings', val, key)
  },
  async delete (key) {
    return (await dbPromise).delete('settings', key)
  },
  async clear () {
    return (await dbPromise).clear('settings')
  },
  async keys () {
    return (await dbPromise).getAllKeys('settings')
  }
}

export default {
  data () {
    return {
      settingsForm: {
        address: '',
        apiKey: ''
      }
    }
  },
  components: {
    AppFrame
  },
  create () {
    this.loadSettings()
  },
  methods: {
    loadSettings () {
      settingsDB.get('ambanic-edge-address').then(
        (address) => {
          this.settingsForm.address = address
        }
      )
      settingsDB.get('ambanic-edge-api-key').then(
        (apiKey) => {
          this.settingsForm.apiKey = apiKey
        }
      )
    },
    saveSettings () {
      settingsDB.set('ambanic-edge-address', this.settingsForm.address)
      settingsDB.set('ambanic-edge-api-key', this.settingsForm.apiKey)
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
