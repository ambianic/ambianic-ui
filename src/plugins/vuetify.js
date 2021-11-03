import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const mq = window.matchMedia('(prefers-color-scheme: dark)')

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: mq.matches
  }
})

export default vuetify
