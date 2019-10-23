<template>
  <v-row
   align="center"
   justify="center"
  >
    <v-container style="max-width: 600px;">
      <v-timeline dense clipped>
        <v-timeline-item
          fill-dot
          class="white--text mb-12"
          color="orange"
          large
          v-for="(sample, index) in samples" :key="index">
        >
          <img :src='imagePath(sample.image)'/>
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
        <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler"/>
      </v-timeline>
    </v-container>
  </v-row>
</template>

<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import axios from 'axios'
import ambianicConf from '../../config.js'
import InfiniteLoading from 'vue-infinite-loading'
import Vue from 'vue'

Vue.use(InfiniteLoading, { /* options */
  slots: {
    // keep default styles
    noResults: 'No data available on your timeline yet.',
    noMore: 'End of your timeline archive.'
  }
})

const API_ROOT = ambianicConf['AMBIANIC_API_URI']
const API_SAMPLES_PATH = API_ROOT + 'samples'
// console.debug('API_SAMPLES_PATH: ' + API_SAMPLES_PATH)

export default {
  data () {
    return {
      samples: [],
      // infinite loading attributes
      page: 1,
      infiniteId: +new Date(),
      addSampleForm: {
        title: '',
        author: '',
        read: false
      },
      editSampleForm: {
        id: '',
        title: '',
        author: '',
        read: false
      },
      message: '',
      showMessage: false
    }
  },
  components: {
    //    alert: Alert,
  },
  methods: {
    infiniteHandler ($state) {
      const api = API_SAMPLES_PATH
      axios.get(api, {
        params: {
          page: this.page
        }
      }).then(({ data }) => {
        if (data.samples.length) {
          // console.debug('this.page: ' + this.page)
          this.page += 1
          this.samples.push(...data.samples)
          // console.debug('data.samples.length: ' + data.samples.length)
          // console.debug('this.samples.length: ' + this.samples.length)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    imagePath (imageName) {
      let p = API_ROOT + 'data/detections/front-door/faces/' + imageName
      // console.debug('imagePath: ' + p)
      return p
    },
    getSamples () {
      const path = API_SAMPLES_PATH
      axios.get(path)
        .then((res) => {
          this.samples = res.data.samples
          // console.debug('res.data:' + JSON.stringify(res.data));
          // console.debug('samples:' + JSON.stringify(this.samples));
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        })
    },
    addSample (payload) {
      const path = API_SAMPLES_PATH
      axios.post(path, payload)
        .then(() => {
          this.getSamples()
          this.message = 'Sample added!'
          this.$refs.alert.showAlert()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          this.getSamples()
        })
    },
    updateSample (payload, sampleID) {
      // console.debug('updating sample id: ' + sampleID + ' paylod: ' + JSON.stringify(payload));
      const path = API_SAMPLES_PATH + `/${sampleID}`
      axios.put(path, payload)
        .then(() => {
          this.getSamples()
          this.message = 'Sample updated!'
          this.$refs.alert.showAlert()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          this.getSamples()
        })
    },
    initForm () {
      this.addSampleForm.title = ''
      this.addSampleForm.author = ''
      this.addSampleForm.read = false
      this.editSampleForm.id = ''
      this.editSampleForm.title = ''
      this.editSampleForm.author = ''
      this.editSampleForm.read = false
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.$refs.addSampleModal.hide()
      let read = false
      if (this.addSampleForm.read) read = true
      const payload = {
        title: this.addSampleForm.title,
        author: this.addSampleForm.author,
        read // property shorthand
      }
      this.addSample(payload)
      this.initForm()
    },
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addSampleModal.hide()
      this.initForm()
    },
    editSample (sample) {
      // console.info('Transfering sample from table to edit form: ' + JSON.stringify(sample));
      this.editSampleForm = sample
    },
    onSubmitUpdate (evt) {
      evt.preventDefault()
      this.$refs.editSampleModal.hide()
      let read = false
      if (this.editSampleForm.read) read = true
      const payload = {
        title: this.editSampleForm.title,
        author: this.editSampleForm.author,
        read
      }
      this.updateSample(payload, this.editSampleForm.id)
    },
    onResetUpdate (evt) {
      evt.preventDefault()
      this.$refs.editSampleModal.hide()
      this.initForm()
      this.getSamples() // update view
    },
    deleteSample (sampleID) {
      const path = API_SAMPLES_PATH + `/${sampleID}`
      axios.delete(path)
        .then(() => {
          this.getSamples()
          this.message = 'Sample removed!'
          this.$refs.alert.showAlert()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          this.getSamples()
        })
    },
    onDeleteSample (sample) {
      this.deleteSample(sample.id)
    }
  },
  created () {
    // this.getSamples();
  }
}
</script>
