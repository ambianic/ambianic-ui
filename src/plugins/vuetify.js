import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import manifestJSON from '../../public/manifest.json'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    primary: manifestJSON.theme_color,
    secondary: 0x00bcd4,
    accent: 0x9c27b0,
    error: 0xf44336,
    warning: 0xff9800,
    info: 0x607d8b,
    success: 0x4caf50
  }
})
