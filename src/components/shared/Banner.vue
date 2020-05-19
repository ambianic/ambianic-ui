<template>
  <v-banner
    two-line
    :class="bannerClass"
  >
    <v-icon
      slot="icon"
      size="36"
    >
      mdi-{{ icon }}
    </v-icon>
    {{ text }}
    <v-progress-linear
      v-if="progress"
      color="info"
      indeterminate
      :size="50"
      :width="7"
    />
  </v-banner>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    bannerClass: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    progress: {
      type: Boolean,
      default: false
    }
  }
}
</script>
