import Vue from 'vue'
import routes from './routes/routes.js'
import store from './store/index.js'
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
  window.__store__ = store
}
