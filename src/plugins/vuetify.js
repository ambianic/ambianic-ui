import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import manifestJSON from '../../public/manifest.json'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    primary: manifestJSON.theme_color
  }
})
