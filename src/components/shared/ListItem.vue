
<template>
  <v-list-item :two-line="twoLine">
    <v-list-item-icon>
      <v-icon :color="iconColor">
        mdi-{{ iconName }}
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content>
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
export default {
  name: 'ListItem',
  props: {
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
  }
}
</script>
