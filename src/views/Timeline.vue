<template>
  <amb-app-frame>
    <v-row
      align="start"
      justify="center"
      dense
      v-if="!isEdgeConnected"
    >
      <v-col :style="maxWidth">
        <v-card>
          <v-card-title
            data-cy="title-disconnected"
          >
            Connect to a device
          </v-card-title>
          <v-card-subtitle>
            Timeline view requires device connection.
          </v-card-subtitle>
          <v-card-text
            color="warning"
          >
            <p>Connect to an Ambianic Edge device and come back to this page to see its timeline of events.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              data-cy="btn-settings"
              to="settings"
            >
              <span>Settings</span>
              <v-icon>settings</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
      dense
      v-else
    >
      <v-col
        :style="maxWidth"
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
            ref="timeline-data"
            data-cy="timelinedata"
            v-for="(eventData, index) in timeline"
            :key="index"
            class="pa-0 ma-0"
          >
            <v-list-item-content
              class="pa-0 ma-0"
            >
              <event-card
                :data="eventData"
                ref="event-card"
              />
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
  </amb-app-frame>
</template>
<style lang="stylus" scoped>
.see-thru {
  opacity: 0.8
}
</style>
<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Vue from 'vue'
import VueObserveVisibility from 'vue-observe-visibility'
import { mapState } from 'vuex'
import {
  PEER_CONNECTED,
  NEW_REMOTE_PEER_ID
} from '@/store/mutation-types'

Vue.use(VueObserveVisibility)
const PAGE_SIZE = 5
export default {
  data () {
    return {
      connectionBarText: '',
      connectionBarVisibility: false,
      timeline: [],
      clearTimeline: true, // flag to clear timeline when Edge Peer ID changes
      on: true,
      isTopSpinnerVisible: false, // flags whether the timeline is in the process of loading data
      // maxWidth responsively controls the maximum width for the timeline component.
      // The goal is to keep it slim and centered similar to other social timeline views that users are accustomed to.
      maxWidth: ''
    }
  },
  created () {
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
  mounted () {
    const maxPixels = window.innerWidth < 600 ? window.innerWidth : 600
    this.maxWidth = `max-width: ${maxPixels}px;`
  },
  beforeDestroy () {
    this.pnpUnsubscribe()
  },
  components: {
    InfiniteLoading: () => import('vue-infinite-loading'),
    AmbAppFrame: () => import('@/components/AppFrame.vue'),
    EventCard: () => import('@/components/EventCard')
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
    async fetchTimelinePageUntilSuccess (pageno) {
      // keep trying to fetch a timeline page until success
      var timelineEvents
      do {
        try {
          if (this.pnp.edgeAPI) {
            timelineEvents = await this.pnp.edgeAPI.getTimelinePage(pageno)
          } else {
            console.info('edgeAPI instance is not available at the moment. Will retry in a little bit.') // eslint-disable-line no-console
            await new Promise(resolve => setTimeout(resolve, 2000)) // sleep for 2 seconds
          }
        } catch (error) {
          console.info('Unable to feetch timeline page. Will keep trying. ', error) // eslint-disable-line no-console
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
    }
  }
}
</script>
