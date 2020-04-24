<template>
  <app-frame>
    <v-row
      align="start"
      justify="space-around"
    >
      <v-col
        v-if="!isEdgeConnected"
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-card
          class="mx-auto"
          outlined
        >
          <v-card-title>
            <v-icon
              slot="icon"
              size="36"
            >
              mdi-wifi-off
            </v-icon>
            Connecting to Ambianic Edge device...
            <v-progress-linear
              color="info"
              indeterminate
              :size="50"
              :width="7"
            >
            </v-progress-linear>
          </v-card-title>

          <v-card-text>
            In most cases, connecting to your edge device is automatic.
            If you are not connected within a few moments, click the
            button below to review settings.
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              to="/edge-connect"
            >
              Connection Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        v-else
        style="max-width: 420px;"
        align="center"
        justify="center"
        cols="12"
        class="pa-0 ma-0 fill-height"
      >
        <v-list
          dense
          class="pa-0 ma-0"
        >
          <v-list-item
            v-for="(sample, index) in timeline"
            :key="index"
            class="pa-0 ma-0"
          >
            <v-list-item-content
              class="pa-0 ma-0"
            >
              <v-img
                v-if="sample.args.thumbnail_file_name"
                :src="imageURL[index]"
                class="white--text align-start"
                alt="Object Detection"
                contain
                @load="setImageLoaded(index)"
              >
                <v-row
                  class="fill-height ma-0"
                  align="start"
                  justify="start"
                >
                  <template v-slot:placeholder>
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
                  </template>
                  <template
                    v-if="isImageLoaded[index]"
                  >
                    <detection-boxes
                      :detections="sample.args.inference_result"
                      :tensor_image_size="sample.args.inference_meta.tensor_image_size"
                    />
                    <v-avatar
                      :color="eventColor(sample)"
                      size="62"
                      left
                      align="top"
                      class="font-weight-regular pa-4 ma-6 see-thru"
                    >
                      <v-icon
                        dark
                        large
                      >
                        {{ eventIcon(sample) }}
                      </v-icon>
                    </v-avatar>
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
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
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
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
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
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-heart</v-icon>
                          </v-btn>
                        </template>
                        <span>Save to Favorites</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                          >
                            <v-icon>mdi-pen</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit event details</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
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
          <infinite-loading @infinite="infiniteHandler">
            <span slot="no-more">
              There are no more timeline events.
            </span>
          </infinite-loading>
        </v-list>
      </v-col>
    </v-row>
  </app-frame>
</template>
<style lang="stylus" scoped>
  .see-thru {
    opacity: 0.8
  }
</style>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import InfiniteLoading from 'vue-infinite-loading'
import DetectionBoxes from '../components/DetectionBoxes.vue'
import AppFrame from '@/components/AppFrame.vue'
import { EdgeAPI } from '@/remote/edgeAPI'
import { mapState } from 'vuex'
import {
  PEER_CONNECTED
} from '@/store/mutation-types'

const PAGE_SIZE = 5

export default {
  data () {
    return {
      timeline: [],
      imageURL: [],
      isImageLoaded: [],
      on: true
    }
  },
  created () {
    this.initEdgeAPI()
  },
  components: {
    AppFrame,
    DetectionBoxes,
    InfiniteLoading
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
    initEdgeAPI () {
      this.edgeAPI = new EdgeAPI(this.pnp)
    },
    setImageLoaded (index) {
      this.$set(this.isImageLoaded, index, true)
      // eslint-disable-next-line
      // console.log(`isImageLoaded[${index}]: ${this.isImageLoaded[index]}`)
    },
    updateImageURL (relDir, fileName, index) {
      this.edgeAPI.getImageURL(relDir, fileName).then(fullImageURL => {
        this.$set(this.imageURL, index, fullImageURL)
      })
    },
    async getTimelineSlice () {
      const timelineEvents = await this.edgeAPI.getTimelinePage(this.timeline.length / PAGE_SIZE + 1)
      console.debug('getTimelineSlice received data', { timelineEvents }) // eslint-disable-line no-console
      return timelineEvents
    },
    async infiniteHandler ($state) {
      try {
        const data = await this.getTimelineSlice()
        console.debug('Infinite handler received timeline slice', { data }) // eslint-disable-line no-console
        // Are there any more timeline events left?
        if (data && data.timeline && data.timeline.length > 0) {
          // eslint-disable-next-line
          // console.debug('new timeline events: ', data.timeline.length)
          // eslint-disable-next-line
          // console.log('timeline slice: ' + JSON.stringify(data.timeline))
          const startIndex = this.timeline.length
          // update full image URLs
          data.timeline.map(
            (sample, index) =>
              this.updateImageURL(sample.args.rel_dir,
                sample.args.thumbnail_file_name,
                startIndex + index)
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
    eventIcon (event) {
      let topLabel = 'none'
      const inf = event.args.inference_result
      if (inf.length > 0) {
        topLabel = inf[0].label
      }
      let icon = 'mdi-crosshairs-question'
      // eslint-disable-next-line
      // console.log('label: ' + JSON.stringify(topLabel))
      switch (topLabel) {
        case 'person':
          icon = 'mdi-human'
          break
        case 'face':
          icon = 'mdi-face'
          break
        case 'car':
          icon = 'mdi-car'
          break
        case 'cat':
          icon = 'mdi-cat'
          break
        case 'dog':
          icon = 'mdi-dog'
          break
      }
      // eslint-disable-next-line
      // console.log('icon: ' + icon)
      return icon
    },
    friendlyTime (datetime) {
      var moment = require('moment')
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
