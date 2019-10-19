import Vue from 'vue'
import manifestJSON from '../../public/manifest.json'
import 'vuetify/dist/vuetify.min.css'

import {
  Vuetify,
  VApp,
  VBtn,
  VBtnToggle,
  VCard,
  VCheckbox,
  VDivider,
  VGrid,
  VIcon,
  VList,
  VProgressLinear,
  VTextField
} from 'vuetify/lib'

Vue.use(Vuetify)

const vuetifyOpts = {
  components: {
    VApp,
    VBtn,
    VBtnToggle,
    VCard,
    VCheckbox,
    VDivider,
    VGrid,
    VIcon,
    VList,
    VProgressLinear,
    VTextField
  },
  theme: {
    primary: manifestJSON.theme_color
  },
  icons: {
    iconfont: 'mdi'
  }
  //  theme: appConfig.theme
}

export default new Vuetify(vuetifyOpts)
