import Vue from 'vue'
import App from './App.vue'
import routes from './routes/routes.js'
import store from './store/index.js'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import VuePageTransition from 'vue-page-transition'

import { Auth0Plugin } from './auth/'
require('dotenv').config()
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.use(VueRouter)
Vue.use(VuePageTransition)

const CLIENTDOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
const CLIENTSECRET = process.env.VUE_APP_AUTH0_CLIENTID

// AUTH0 PLUGIN
Vue.use(Auth0Plugin, {
  CLIENTDOMAIN,
  CLIENTSECRET,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

if (window.Cypress) {
  window.__store__ = store
}
