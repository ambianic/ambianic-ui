<template>
  <v-list-item :two-line="twoLine">
    <v-list-item-icon>
      <v-icon>
        mdi-{{ iconName }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-skeleton-loader
        v-if="!title"
        v-bind="attrs"
        data-cy="title-loader"
        type="list-item-two-line"
      />
      <v-list-item-title
        v-else-if="sensitiveField"
      >
        <input
          :value="title"
          :placeholder="title"
          disabled
          id="peerId-container"
          :type="sensitive ? 'password' : 'text'"
          data-cy="input-title"
        >
      </v-list-item-title>
      <v-list-item-title
        v-else
        data-cy="title-text"
        id="title"
      >
        {{ title }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ subtitle }}
      </v-list-item-subtitle>

      <v-list-item-subtitle
        v-if="error"
        data-cy="item-error"
        class="warning"
      >
        {{ error }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-tooltip
        v-if="sensitiveField"
        bottom
      >
        <template
          #activator="{ on, attrs }"
        >
          <v-icon
            style="padding-bottom: 14px"
            v-if="sensitive"
            id="toggle-visibility"
            @click="sensitive = false"
            data-cy="icon-sensitive-on"
            v-bind="attrs"
            v-on="on"
          >
            mdi-eye
          </v-icon>
          <v-icon
            style="padding-bottom: 15px"
            v-else
            @click="sensitive = true"
            v-bind="attrs"
            v-on="on"
          >
            mdi-eye-off-outline
          </v-icon>
        </template>
        <span>Show/Hide cleartext</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template
          #activator="{ on, attrs }"
        >
          <v-icon
            style="padding-bottom: 14px"
            v-if="copyOption"
            id="toggle-copy-option"
            @click="doCopy"
            data-cy="icon-copy-on"
            v-bind="attrs"
            v-on="on"
          >
            content_copy
          </v-icon>
        </template>
        <span>Copy to clipboard</span>
      </v-tooltip>
    </v-list-item-action>
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
    },
    error: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      sensitive: true,
      attrs: {
        boilerplate: true,
        elevation: 2
      }
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
