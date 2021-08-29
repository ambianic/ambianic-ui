import Vue from 'vue'
import routes from './routes/routes.js'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

// dynamic import of views as needed
// to minimize page response time
// ref: https://vuedose.tips/dynamic-imports-in-vue-js-for-better-performance
const App = () => import('./App.vue')

// disable dev time warning from server
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.use(VueRouter)

const VueApp = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
})

VueApp.$mount('#app')

if (window.Cypress) {
  // allows Cypress tests to wait until the vue app mounts and access vue state
  // See https://docs.cypress.io/api/commands/window#Start-tests-when-app-is-ready
  window.__VueApp__ = VueApp
  // Allows Cypress tests to see Vuex data. Shorthand for accessing via __VueApp__.
  window.__store__ = store
}
