<template>
  <v-row
   align="center"
   align-content="center"
   justify="center"
   no-gutters
   style="max-width: 100%;"
   class="pa-0 ma-0"
  >
    <v-col
      align="left"
      justify="left"
      cols="12"
      class="pa-0 ma-0 fill-height"
    >
      <v-list
        dense
        class="pa-0 ma-0"
      >
      <v-list-item
        v-for="(sample, index) in timeline" v-bind:key="index"
        class="pa-0 ma-0"
      >
        <v-list-item-content
          class="pa-0 ma-0"
        >
          <v-img
            v-if="sample.args.image_file_name"
            :src='imagePath(sample.args.rel_dir, sample.args.image_file_name)'
            class="white--text align-start"
            alt="Object Detection"
            contain
          >
            <v-avatar
              :color="eventColor(sample)" size="62" left
              align="top"
              class="font-weight-regular pa-4 ma-6 see-thru"
            >
              <v-icon dark large>{{ eventIcon(sample) }}</v-icon>
            </v-avatar>
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
                        fab
                        color="success lighten-2"
                        class="mx-2"
                        v-on="on"
                      >
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </template>
                    <span>Looks fine</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        color="error lighten-2"
                        fab
                        class="mx-2"
                        v-on="on"
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
                      <v-btn icon v-on="on">
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </template>
                    <span>Save to Favorites</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-icon>mdi-pen</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit event details</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
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
                     <div class="subtitle-2">{{ sample.message }}</div>
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
               v-for="(inf, index) in sample.args.inference_result"
               v-bind:key="index"
               :data-num="index + 1"
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
                <v-col cols="1">
                </v-col>
            </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-list-item-content>
      </v-list-item>
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
import axios from 'axios'
import ambianicConf from '../../config.js'

const API_ROOT = ambianicConf['AMBIANIC_API_URI']
const API_TIMELINE_PATH = API_ROOT + 'timeline.json'
// console.debug('API_TIMELINE_PATH: ' + API_TIMELINE_PATH)

export default {
  data () {
    return {
      timeline: [],
      on: true
    }
  },
  methods: {
    imagePath (relDir, imageName) {
      let p = API_ROOT + 'data/' + relDir + '/' + imageName
      // console.debug('imagePath: ' + p)
      return p
    },
    getTimeline () {
      const path = API_TIMELINE_PATH
      axios.get(path)
        .then((res) => {
          this.timeline = res.data.timeline
          // console.debug('res.data:' + JSON.stringify(res.data));
          // console.debug('timeline:' + JSON.stringify(this.timeline));
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        })
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
      let inf = event.args.inference_result
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
      return moment(datetime).calendar()
    },
    asPercentage (number) {
      let p = Number(number).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 0 })
      return p
    }
  },
  created () {
    this.getTimeline()
  }
}
</script>
