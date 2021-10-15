<template>
  <v-list-item :two-line="twoLine">
    <v-list-item-icon>
      <v-icon>
        mdi-{{ iconName }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title
        v-if="isEditing"
      >
        <v-text-field
          v-model="inputTitleEditValue"
          :type="sensitive ? 'password' : 'text'"
          @keyup.enter="saveEdit"
          :rules="rules"
          data-cy="input-title-edit"
          ref="inputTitleEdit"
        />
      </v-list-item-title>
      <v-skeleton-loader
        v-else-if="!inputTitleEditValue"
        v-bind="attrs"
        data-cy="title-loader"
        type="list-item-two-line"
      />
      <v-list-item-title
        v-else-if="sensitiveField"
      >
        <v-text-field
          v-model="inputTitleEditValue"
          disabled
          id="peerId-container"
          :type="sensitive ? 'password' : 'text'"
          data-cy="input-title-sensitive"
        />
      </v-list-item-title>
      <v-list-item-title
        v-else
        data-cy="title-text-read-only"
        ref="title-read-only"
      >
        {{ inputTitleEditValue }}
      </v-list-item-title>

      <v-list-item-subtitle
        ref="subtitle-label"
      >
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
          #activator="{ on : eyeOn, eyeOffAttr }"
        >
          <v-icon
            v-if="sensitive"
            id="toggle-visibility"
            @click="sensitive = false"
            data-cy="icon-sensitive-on"
            v-bind="eyeOffAttr"
            v-on="eyeOn"
          >
            mdi-eye
          </v-icon>
          <v-icon
            v-else
            @click="sensitive = true"
            v-bind="eyeOffAttr"
            v-on="eyeOn"
          >
            mdi-eye-off-outline
          </v-icon>
        </template>
        <span>Show/Hide cleartext</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template
          #activator="{ on, attrs : copyIcon }"
        >
          <v-icon
            v-if="copyOption"
            id="toggle-copy-option"
            @click="doCopy"
            data-cy="icon-copy-on"
            v-bind="copyIcon"
            v-on="on"
          >
            content_copy
          </v-icon>
        </template>
        <span>Copy to clipboard</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="editOption && !isEditing"
      >
        <template #activator="{ on, copyIcon }">
          <v-icon
            id="toggle-edit-option"
            @click="startEdit"
            data-cy="icon-start-edit"
            ref="icon-start-edit"
            v-bind="copyIcon"
            v-on="on"
          >
            edit
          </v-icon>
        </template>
        <span>Edit field value.</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="editOption && isEditing"
      >
        <template #activator="{ on, attrs : toggleIcon }">
          <v-icon
            id="toggle-edit-option"
            @click="saveEdit"
            data-cy="icon-save-edit"
            ref="icon-save-edit"
            v-bind="toggleIcon"
            v-on="on"
          >
            done
          </v-icon>
        </template>
        <span>Save changes</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="editOption && isEditing"
      >
        <template #activator="{ on, attrs : editIcon }">
          <v-icon
            id="toggle-edit-option"
            @click="cancelEdit"
            data-cy="icon-cancel-edit"
            ref="icon-cancel-edit"
            v-bind="editIcon"
            v-on="on"
          >
            clear
          </v-icon>
        </template>
        <span>Cancel edit</span>
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
    editOption: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: undefined
    },
    onSubmit: {
      type: Function,
      default: function () {}
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      sensitive: this.sensitiveField,
      attrs: {
        boilerplate: true,
        elevation: 2
      },
      isEditing: false,
      inputTitleEditValue: this.title
    }
  },
  methods: {
    doCopy: async function () {
      try {
        await this.$copyText(this.title)
      } catch (e) {
        console.debug('Can not copy `title` element value to clipboard', e)
      }
    },
    startEdit: async function () {
      this.isEditing = true
      this.$nextTick(() => this.$refs.inputTitleEdit.focus())
    },
    saveEdit: async function (e) {
      const newValue = this.inputTitleEditValue
      console.debug(`saveEdit called with value: ${newValue}`)
      for (let index = 0; index < this.rules.length; index++) {
        const rule = this.rules[index]
        console.debug(`next rule: ${rule}`)
        const valid = typeof rule === 'function' ? rule(newValue) : rule
        if (valid !== true) return
      }
      if (!await this.onSubmit(newValue)) {
        // if onSubmit did not succeed, revert the edit
        console.debug('onSubmit failed')
        this.cancelEdit()
      }
      this.isEditing = false
      console.debug('saveEdit ended')
    },
    cancelEdit: async function () {
      this.isEditing = false
      this.inputTitleEditValue = this.title
    }
  },
  watch: {
    title (value) {
      this.inputTitleEditValue = value
    }
  }
}
</script>
