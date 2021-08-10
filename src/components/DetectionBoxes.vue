<template>
  <div
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    v-resize.initial="onResize"
    ref="container"
    v-if="detections.length > 0 && detections[0].box !== undefined"
  >
    <v-overlay
      absolute
      overlay="true"
      opacity="0"
      z-index="0"
    >
      <v-stage
        ref="stage"
        :config="stageSize"
      >
        <v-layer>
          <v-rect
            v-for="(inf, rect_index) in detections"
            :key="rect_index"
            :config="{
              x: inf.box.xmin * stageSize.width,
              y: inf.box.ymin * stageSize.height,
              width: (inf.box.xmax - inf.box.xmin) * stageSize.width,
              height: (inf.box.ymax - inf.box.ymin) * stageSize.height,
              stroke: 'white',
              strokeWidth: 4,
              shadowColor: 'black',
              shadowBlur: 10,
              shadowOpacity: 1,
              preventDefault: false
            }"
          />
        </v-layer>
        <v-layer ref="dragLayer" />
      </v-stage>
    </v-overlay>
  </div>
</template>

<script>
import Vue from 'vue'
import resize from 'vue-resize-directive'
import VueKonva from 'vue-konva'

Vue.use(VueKonva)

// let vm = {}
export default {
  data () {
    return {
      stageSize: {
        width: 10,
        height: 10
      }
    }
  },
  props: {
    detections: {
      type: Array,
      default: () => []
    }
  },
  directives: {
    resize
  },
  created () {
    //  console.info('Drawing detection boxes for', this.detections) // eslint-disable-line no-console
  },
  methods: {
    changeRect: function () {
      const container = this.$refs.container

      if (!container) {
        return
      }

      // let width = container.offsetWidth
      // let height = container.offsetWidth
      // console.log('container w, h: ', width, height)
      // console.log('container: ', container)
      // console.log('container parent: ', container.parentElement)

      // Resize the canvas to fit its parent's width.
      const width = container.offsetWidth
      const height = container.offsetHeight
      // console.log('container w, h: ', width, height)

      this.stageSize.width = width
      this.stageSize.height = height
      // console.log('stage w, h: ', width, height)
    },
    onResize: function () {
      // console.log('onResize called')
      this.changeRect()
    }
  }
}
</script>
