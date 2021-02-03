<template>
  <v-list-item :two-line="twoLine">
    <v-list-item-icon>
      <v-icon :color="iconColor">
        mdi-{{ iconName }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content v-if="sensitiveField">
      <div style="display : flex; justify-content: space-between">
        <div style="display : flex; flex-direction: column;">
          <v-list-item-title class="headline">
            <input
              style=" color: black; width: 100%;"
              :value="sensitive ? divideIdValue(title) : title"
              :placeholder="sensitive ? divideIdValue(title) : title"
              disabled
              id="peerId-container"
              :type="sensitive ? 'password' : 'text'"
            >
          </v-list-item-title>

          <div style="display: flex; align-items: center; justify-content: center;">
            <v-list-item-subtitle>
              {{ subtitle }}
            </v-list-item-subtitle>
          </div>
        </div>

        <v-icon
          style="padding-bottom: 15px"
          v-if="sensitive"
          id="toggle-visibility"
          @click="sensitive = false"
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
      </div>
    </v-list-item-content>

    <v-list-item-content v-else>
      <v-list-item-title class="headline">
        <h3 class="title-text" > {{ title }} </h3>
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
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
    iconColor: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      sensitive: true
    }
  },
  methods: {
    divideIdValue (id) {
      const arr = id.split('')
      arr.splice(0, arr.length / 2)
      return arr.join('')
    }
  }
}
</script>

<style>
.title-text {
  font-weight: normal;
}

@media (max-width: 900px) {
  .title-text {
    font-size: 1.4rem !important;
  }
}

@media (max-width: 400px) {
  .title-text {
    font-size: 1.15rem !important;
  }
}
</style>
