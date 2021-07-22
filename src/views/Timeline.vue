<template>
  <v-row
    align="start"
    justify="space-around"
  >
    <v-col
      style="max-width: 400px;"
      align="center"
      justify="center"
      cols="12"
      class="pa-0 ma-0 fill-height"
    >
      <v-list
        dense
        class="pa-0 ma-0"
      >
        <infinite-loading
          direction="top"
          @infinite="infiniteHandlerTop"
          v-observe-visibility="topSpinnerVisibilityChanged"
        >
          <span slot="no-more">
            There are no new timeline events.
          </span>
        </infinite-loading>
        <v-list-item
            id="timeline-data"
          data-cy="timelinedata"
          v-for="(sample, index) in timeline"
          :key="index"
          class="pa-0 ma-0"
        >
          <v-list-item-content
            class="pa-0 ma-0"
          >
            <v-img
              v-if="sample.args.thumbnail_file_name"
              :src="imageURL[sample.args.id]"
              class="white--text align-start"
              alt="Detection Event"
              contain
              @load="setImageLoaded(index)"
              lazy-src="/img/lazy-load-bg.gif"
            >
              <template #placeholder>
                <div>
                  <br />
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
                <template v-if="isImageLoaded[index]">
                  <detection-boxes
                    :detections="sample.args.inference_result"
                    :tensor_image_size="
                      sample.args.inference_meta.tensor_image_size
                    "
                  />
                  <event-icon :data="sample" />
                </template>
              </v-row>
            </v-img>
            <v-timeline
              align-top
              clipped
              dense
            >
              <v-timeline-item
                hide-dot
                v-if="sample.args.inference_result.length > 0"
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
              <v-timeline-item
                :color="eventColor(sample)"
                small
              >
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>{{ friendlyTime(sample.args.datetime) }}</strong>
                  </v-col>
                  <v-col>
                    <div class="subtitle-2">
                      {{ sample.message }}
                    </div>
                    <div class="body-2">
                      {{ sample.pipeline_display_name }} -
                      {{ sample.args.inference_meta.display }}
                    </div>
                  </v-col>
                </v-row>
              </v-timeline-item>

              <v-timeline-item
                color="teal lighten-3"
                small
                v-for="(inf, inf_index) in sample.args.inference_result"
                :key="inf_index"
                :data-num="inf_index + 1"
              >
                <v-row class="pt-1">
                  <v-col cols="3">
                    <strong>{{ inf.label }}</strong>
                  </v-col>
                  <v-col>
                    <strong>{{ asPercentage(inf.confidence) }} confidence</strong>
                  </v-col>
                </v-row>
              </v-timeline-item>
              <v-timeline-item
                hide-dot
                v-if="sample.args.inference_result.length > 0"
              >
                <v-row class="pt-1">
                  <v-col cols="1" />
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-list-item-content>
        </v-list-item>
        <infinite-loading
          @infinite="infiniteHandlerBottom"
          v-if="!isTopSpinnerVisible"
        >
          <span slot="no-more">
            There are no more timeline events.
          </span>
        </infinite-loading>
      </v-list>
    </v-col>
  </v-row>
</template>
<style lang="stylus" scoped>
.see-thru {
  opacity: 0.8
}
</style>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import InfiniteLoading from 'vue-infinite-loading'
import DetectionBoxes from '@/components/DetectionBoxes.vue'
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import { EdgeAPI } from '@/remote/edgeAPI'
import { mapState } from 'vuex'
import EventIcon from '@/components/EventIcon.vue'
import moment from 'moment'
import {
  PEER_CONNECTED,
  NEW_REMOTE_PEER_ID
} from '@/store/mutation-types'
Vue.use(VueObserveVisibility)
const PAGE_SIZE = 5
export default {
  data () {
    return {
      timeline: [],
      clearTimeline: true, // flag to clear timeline when Edge Peer ID changes
      imageURL: {}, // map[id, fullURL] - maps unique event id to their full thumbnail URLs
      isImageLoaded: [],
      on: true,
      isTopSpinnerVisible: false // flags whether the timeline is in the process of loading data
    }
  },
  created () {
    this.edgeAPI = new EdgeAPI(this.pnp)
    this.pnpUnsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === NEW_REMOTE_PEER_ID) {
        // eslint-disable-next-line
        console.debug(`New Edge Peer ID ${state.pnp.remotePeerId}`)
        // eslint-disable-next-line
        console.debug('Clearing event timeline received from previous Peer ID')
        this.clearTimeline = true
        this.isTopSpinnerVisible = true // enable auto refresh
      }
    })
  },
  beforeDestroy () {
    this.pnpUnsubscribe()
  },
  components: {
    DetectionBoxes,
    InfiniteLoading,
    EventIcon
  },
  computed: {
    ...mapState({
      peerConnectionStatus: state => state.pnp.peerConnectionStatus,
      // map this.edgeConnected to this.$store.state.edgeConnected
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: state => state.pnp.remotePeerId,
      peerFetch: state => state.pnp.peerFetch,
      pnp: state => state.pnp
    })
  },
  methods: {
    setImageLoaded (index) {
      this.$set(this.isImageLoaded, index, true)
      // eslint-disable-next-line
      // console.log(`isImageLoaded[${index}]: ${this.isImageLoaded[index]}`)
    },
    updateImageURL (relDir, fileName, id) {
      this.edgeAPI.getImageURL(relDir, fileName).then(fullImageURL => {
        this.$set(this.imageURL, id, fullImageURL)
      })
    },
    async fetchTimelinePageUntilSuccess (pageno) {
      // keep trying to fetch a timeline page until success
      var timelineEvents
      do {
        try {
          timelineEvents = await this.edgeAPI.getTimelinePage(pageno)
        } catch (error) {
          console.info('Unable to feetch timeline page. Will keep trying.', error) // eslint-disable-line no-console
          await new Promise(resolve => setTimeout(resolve, 2000)) // sleep for 2 seconds
        }
      } while (timelineEvents === undefined)
      console.debug('fetchTimelinePageUntilSuccess received data', { timelineEvents }) // eslint-disable-line no-console
      return timelineEvents
    },
    async getTopTimelinePage () {
      // get a page with the most recent timeline events
      const timelineEvents = await this.fetchTimelinePageUntilSuccess(1)
      return timelineEvents
    },
    async getBottomTimelinePage () {
      const timelineEvents = await this.fetchTimelinePageUntilSuccess(this.timeline.length / PAGE_SIZE + 1)
      return timelineEvents
    },
    async topSpinnerVisibilityChanged (isVisible, entry) {
      this.isTopSpinnerVisible = isVisible
      console.debug(`topSpinnerVisibilityChanged: ${isVisible}`) // eslint-disable-line no-console
    },
    async infiniteHandlerTop ($state) {
      try {
        if (this.clearTimeline) {
          this.timeline.length = 0
          this.clearTimeline = false
        }
        const data = await this.getTopTimelinePage()
        console.debug('Infinite handler received Top timeline page', { data }) // eslint-disable-line no-console
        // Are there any more timeline events left?
        if (data && data.timeline && data.timeline.length > 0) {
          // eslint-disable-next-line
          // console.debug('new timeline events: ', data.timeline.length)
          // eslint-disable-next-line
          // console.log('timeline slice: ' + JSON.stringify(data.timeline))
          // remove any of events that have already been shown in the current timeline
          let newEvents = data.timeline
          if (this.timeline.length > 0) {
            newEvents = data.timeline.filter(
              (event, index) =>
                Date.parse(this.timeline[0].args.datetime) <
                    Date.parse(event.args.datetime)
            )
          }
          // update full image URLs
          newEvents.forEach(
            (sample, index) =>
              this.updateImageURL(sample.args.rel_dir,
                sample.args.thumbnail_file_name, sample.args.id)
          )
          this.timeline = newEvents.concat(this.timeline)
          $state.loaded()
        } else {
          // no new events available at this time
          $state.loaded()
        }
      } catch (error) {
        // display some kind of error to the user that
        // the backend API call returned an error
        // eslint-disable-next-line
        console.error(error)
      }
    },
    async infiniteHandlerBottom ($state) {
      try {
        if (this.clearTimeline) {
          this.timeline.length = 0
          this.clearTimeline = false
        }
        const data = await this.getBottomTimelinePage()
        console.debug('Infinite handler received Bottom timeline page', { data }) // eslint-disable-line no-console
        // Are there any more timeline events left?
        if (data && data.timeline && data.timeline.length > 0) {
          // eslint-disable-next-line
          // console.debug('new timeline events: ', data.timeline.length)
          // eslint-disable-next-line
          // console.log('timeline slice: ' + JSON.stringify(data.timeline))
          // update full image URLs
          data.timeline.forEach(
            (sample, index) =>
              this.updateImageURL(sample.args.rel_dir,
                sample.args.thumbnail_file_name, sample.args.id)
          )
          this.timeline = this.timeline.concat(data.timeline)
          $state.loaded()
          if (this.timeline.length / PAGE_SIZE === 10 ||
              data.timeline.length < PAGE_SIZE) {
            // 20 pages of timeline events is all we will show
            // in the default view.
            // More historical data can be found via search.
            // Also if the result did not fill up a page
            // then we are at the end of the current newsfeed.
            // User can fefresh in a few moments or we can update automatically.
            $state.complete()
          }
        } else {
          // no more timeline events left
          $state.complete()
        }
      } catch (error) {
        // display some kind of error to the user that
        // the backend API call returned an error
        // eslint-disable-next-line
        console.error(error)
      }
    },
    eventColor (event) {
      let color = 'primary'
      switch (event.priority) {
        case 'INFO':
          color = 'accent'
          break
        case 'WARNING':
          color = 'warning'
          break
        case 'CRITICAL':
          color = 'error'
          break
      }
      color = 'white--text ' + color + ' lighten-2'
      // eslint-disable-next-line
      // console.log('color: ' + color)
      return color
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
