
<template>
  <v-list-item :two-line="twoLine">
    <v-list-item-icon>
      <v-icon>
        mdi-{{ iconName }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content v-if="sensitiveField">
      <v-row dense>
        <v-col>
          <v-list-item-title class="headline">
            <input
              :value="title"
              :placeholder="title"
              disabled
              style="color: #000;"
              id="peerId-container"
              :type="sensitive ? 'password' : 'text'"
              data-cy="input-title"
            >
          </v-list-item-title>

          <div style="display: flex; align-items: center; justify-content: center;">
            <v-list-item-subtitle>
              {{ subtitle }}
            </v-list-item-subtitle>
          </div>
        </v-col>

        <v-col>
          <v-icon
            style="padding-bottom: 14px"
            v-if="sensitive"
            id="toggle-visibility"
            @click="sensitive = false"
            data-cy="icon-sensitive-on"
          >
            mdi-eye
          </v-icon>
          <v-icon
            style="padding-bottom: 15px"
            v-else
            @click="sensitive = true"
          >
            mdi-eye-off-outline
          </v-icon>
        </v-col>
        <v-col>
          <v-icon
            style="padding-bottom: 14px"
            v-if="copyOption"
            id="toggle-copy-option"
            @click="doCopy"
            data-cy="icon-copy-on"
          >
            content_copy
          </v-icon>
        </v-col>
      </v-row>
    </v-list-item-content>

    <v-list-item-content v-else>
      <v-list-item-title class="headline">
        {{ title }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
  name: 'ListItem',
  props: {
    sensitiveField: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: null
    },
    justify: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    iconName: {
      type: String,
      default: null
    },
    twoLine: {
      type: Boolean,
      default: false
    },
    copyOption: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sensitive: true
    }
  },
  methods: {
    doCopy: async function () {
      try {
        await this.$copyText(this.title)
      } catch (e) {
        console.warn('Can not copy `title` element value to clipboard', e)
      }
    }
  }
}
</script>
