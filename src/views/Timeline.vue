<template>
  <v-row
   align="stretch"
   align-content="stretch"
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
          <v-list-item-subtitle>You can setup your own Ambianic timeline.</v-list-item-subtitle>
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
        three-line
        v-for="(sample, index) in timeline" v-bind:key="index"
        class="pa-0 ma-0"
      >
        <v-list-item-content>
          <v-img
            :src='imagePath(sample.args.rel_dir, sample.args.image_file_name)'
            class="white--text align-end"
            alt="Object Detection"
            contain
          >
            <v-card-title>Front door person detection</v-card-title>
            <v-container class="fill-height">
              <v-row align="center">
                <strong class="display-4 font-weight-regular mr-6">8</strong>
                <v-row justify="end">
                  <div class="headline font-weight-light">Monday</div>
                  <div class="text-uppercase font-weight-light">February 2015</div>
                </v-row>
              </v-row>
            </v-container>
          </v-img>
          <v-timeline
            align-top
            clipped
            dense
          >
            <v-timeline-item
              hide-dot
            >
              <v-card-actions>
              <v-btn fab
                color="success lighten-1"
                class="mx-2"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn
                color="error"
                fab
                class="mx-2"
                >
                <v-icon>mdi-bell</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-pen</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
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
      timeline: []
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
    }
  },
  created () {
    this.getTimeline()
  }
}
</script>
