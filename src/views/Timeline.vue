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
      cols="12"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title>This is an example timeline</v-list-item-title>
          <v-list-item-subtitle>You can setup your own personalized home timeline.</v-list-item-subtitle>
          <v-list-item-subtitle>Go to Settings to begin.</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-col>
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
                    <span>Raise ALARM!</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="1">
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
                hide-dot
            >
                About this detection...
                <span>{{ sample.file }}</span>
                <span>{{ sample.id }}</span>
                <span>{{ sample.datetime }}</span>
                <span>
                  <ul
                    v-for="(inf, index) in sample.inference_result"
                    v-bind:key="index"
                    :data-num="index + 1"
                  >
                    <li>
                      <p>Category: {{inf.category}}</p>
                      <p>Confidence: {{inf.confidence}}</p>
                      <p>Box: {{inf.box}}</p>
                    </li>
                  </ul>
                </span>
              </v-timeline-item>
              <v-timeline-item
                         color="pink"
                         small
              >
                <v-row class="pt-1">
                   <v-col cols="3">
                     <strong>5pm</strong>
                   </v-col>
                   <v-col>
                     <strong>New Icon</strong>
                     <div class="caption">Mobile App</div>
                   </v-col>
                 </v-row>
            </v-timeline-item>

            <v-timeline-item
             color="teal lighten-3"
             small
            >
              <v-row class="pt-1">
                <v-col cols="3">
                   <strong>3-4pm</strong>
                </v-col>
                <v-col>
                   <strong>Design Stand Up</strong>
                   <div class="caption mb-2">Hangouts</div>
                   <v-avatar>
                     <v-img
                       src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"
                     ></v-img>
                   </v-avatar>
                   <v-avatar>

                     <v-img
                       src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"
                     ></v-img>
                   </v-avatar>
                   <v-avatar>
                     <v-img
                       src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"
                     ></v-img>
                   </v-avatar>
                </v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
             color="pink"
             small
            >
             <v-row class="pt-1">
               <v-col cols="3">
                 <strong>12pm</strong>
               </v-col>
               <v-col>
                 <strong>Lunch break</strong>
               </v-col>
             </v-row>
            </v-timeline-item>

            <v-timeline-item
             color="teal lighten-3"
             small
            >
             <v-row class="pt-1">
               <v-col cols="3">
                 <strong>9-11am</strong>
               </v-col>
               <v-col>
                 <strong>Finish Home Screen</strong>
                 <div class="caption">Web App</div>
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
      console.log('color: ' + color)
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
      console.log('label: ' + JSON.stringify(topLabel))
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
      console.log('icon: ' + icon)
      return icon
    }
  },
  created () {
    this.getTimeline()
  }
}
</script>
