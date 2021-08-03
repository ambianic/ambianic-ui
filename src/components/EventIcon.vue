<template>
  <v-avatar
    :color="eventColor(data.priority)"
    size="62"
    left
    align="top"
    class="font-weight-regular pa-4 ma-6 see-thru"
  >
    <div v-if="data.args.inference_meta.display === 'Fall Detection'">
      <span
        style="font-size: 2.5rem; color: white;"
        class="iconify"
        id="fall-icon"
        data-icon="tabler-fall"
      />
    </div>

    <v-icon
      dark
      v-else
      large
    >
      {{ eventIcon(data.args.inference_result) }}
    </v-icon>
  </v-avatar>
</template>

<script>
import { setTimelineEventIcon, setTimelineEventColor } from './utils'

export default {
  name: 'EventIcon',
  props: {
    data: {
      type: Object,
      default: function () {},
      required: true
    }
  },
  methods: {
    eventIcon (inferenceResult) {
      return setTimelineEventIcon(inferenceResult)
    },
    eventColor (priority) {
      return setTimelineEventColor(priority)
    }
  }
}
</script>

<style scoped></style>
