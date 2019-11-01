import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import manifestJSON from '../../public/manifest.json'

Vue.use(Vuetify)

const mq = window.matchMedia('(prefers-color-scheme: dark)')

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    dark: mq.matches,
    primary: manifestJSON.theme_color,
    secondary: 0x00bcd4,
    accent: 0x9c27b0,
    error: 0xf44336,
    warning: 0xff9800,
    info: 0x607d8b,
    success: 0x4caf50
  }
})

export default vuetify

mq.addEventListener('change', (e) => {
  if (vuetify.theme) {
    vuetify.theme.dark = e.matches
  }
})
