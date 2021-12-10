<template>
  <div style="display: contents">
    <v-img
      v-if="data.args.thumbnail_file_name"
      :src="thumbnailURL"
      class="white--text align-start"
      alt="Detection Event"
      contain
      @load="setThumbnailLoaded"
      lazy-src="/img/image-icon.png"
    >
      <template #placeholder>
        <div>
          <br>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="info lighten-2"
            />
          </v-row>
        </div>
      </template>
      <v-row
        class="fill-height ma-0"
        align="start"
        justify="start"
      >
        <template v-if="isThumbnailLoaded">
          <detection-boxes
            :detections="data.args.inference_result"
          />
          <event-icon :data="data" />
        </template>
      </v-row>
    </v-img>
    <v-timeline
      align-top
      clipped
      dense
    >
      <!-- TODO: Implement event actions
      <v-timeline-item
        hide-dot
        v-if="data.args.inference_result.length > 0"
      >
        <v-row
          class="pt-1"
        >
          <v-col cols="7">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  v-on="tooltip"
                  fab
                  color="success lighten-2"
                  class="mx-2"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </template>
              <span>Looks fine</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  v-on="tooltip"
                  color="error lighten-2"
                  fab
                  class="mx-2"
                >
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </template>
              <span>Mark as Suspicious</span>
            </v-tooltip>
          </v-col>
          <v-col cols="1">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  icon
                  v-on="tooltip"
                >
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </template>
              <span>Save to Favorites</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  icon
                  v-on="tooltip"
                >
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
              </template>
              <span>Edit event details</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  icon
                  v-on="tooltip"
                >
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </template>
              <span>Share event</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-timeline-item>
      -->
      <v-timeline-item
        :color="eventColor(data.priority)"
        small
      >
        <v-row class="pt-1">
          <v-col cols="3">
            <strong>{{ friendlyTime(data.args.datetime) }}</strong>
          </v-col>
          <v-col
            v-if="data.args.inference_result && data.args.inference_result.length > 0"
          >
            <div
              class="subtitle-2"
              ref="event-title"
            >
              {{ data.message }}
            </div>
            <div
              class="body-2"
              ref="event-display-name"
            >
              {{ data.pipeline_display_name ? data.pipeline_display_name + ' - ' : '' }}
              {{ data.args.inference_meta.display }}
            </div>
          </v-col>
          <v-col
            v-else
          >
            <div
              class="subtitle-2"
              ref="event-title"
            >
              Idle Snapshot
            </div>
            <div
              class="body-2"
              ref="event-display-name"
            >
              No {{ data.args.inference_meta.display }}
            </div>
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        ref="inf-item"
        color="teal lighten-3"
        small
        v-for="(inf, inf_index) in data.args.inference_result"
        :key="inf_index"
        :data-num="inf_index + 1"
      >
        <v-row class="pt-1">
          <v-col cols="3">
            <strong data-testid="inf-label">{{ inf.label }}</strong>
          </v-col>
          <v-col>
            <strong data-testid="inf-score">{{ asPercentage(inf.confidence) }} confidence</strong>
          </v-col>
        </v-row>
      </v-timeline-item>
      <v-timeline-item
        hide-dot
        v-if="data.args.inference_result.length > 0"
      >
        <v-row class="pt-1">
          <v-col cols="1" />
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
import moment from 'moment'
import { getTimelineEventColor } from './utils'
import { mapState } from 'vuex'

export default {
  name: 'EventCard',
  props: {
    data: {
      type: Object,
      default: function () {},
      required: true
    }
  },
  data () {
    return {
      thumbnailURL: undefined,
      isThumbnailLoaded: false
    }
  },
  created () {
    // request async loading of remote image
    this.createLocalImage(this.data.args.rel_dir,
      this.data.args.thumbnail_file_name)
  },
  components: {
    DetectionBoxes: () => import('@/components/DetectionBoxes.vue'),
    EventIcon: () => import('@/components/EventIcon.vue')
  },
  computed: {
    ...mapState({
      pnp: state => state.pnp
    })
  },
  methods: {
    async createLocalImage (relDir, fileName) {
      const localImageURL = await this.pnp.edgeAPI.getLocalImageURL(relDir, fileName)
      this.thumbnailURL = localImageURL
      console.debug(`localImageURL: ${localImageURL}`)
    },
    setThumbnailLoaded (index) {
      this.isThumbnailLoaded = true
      // eslint-disable-next-line
      console.debug(`isThumbnailLoaded: ${this.isThumbnailLoaded}`)
    },
    eventColor (priority) {
      return getTimelineEventColor(priority)
    },
    friendlyTime (datetime) {
      const dt = new Date()
      var tz = dt.getTimezoneOffset()
      // eslint-disable-next-line
      console.debug('event time before local timezone adjustment', { datetime })
      // eslint-disable-next-line
      console.debug('timezone offset', { tz })
      const adjustedLocalTime = moment.utc(datetime).local().calendar()
      // eslint-disable-next-line
      console.debug('local timezone adjusted time of event', { adjustedLocalTime })
      return adjustedLocalTime
    },
    asPercentage (number) {
      const p = Number(number).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })
      return p
    }
  }
}
</script>
