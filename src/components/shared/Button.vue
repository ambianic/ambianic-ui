<template>
  <v-btn
    :icon="isIcon"
    :to="to"
  >
    <v-badge
      v-if="withBadge"
      top
      right
      overlap
      color="error"
      class="align-self-center"
      :content="badgeContent"
      :value="badgeValue"
    >
      <v-icon>mdi-{{ icon }}</v-icon>
    </v-badge>
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'Button',
  props: {
    isIcon: {
      type: Boolean,
      default: false
    },
    badgeContent: {
      type: Number,
      default: null
    },
    badgeValue: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    withBadge: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
