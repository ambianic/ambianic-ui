import Vue from 'vue'
import App from './App.vue'
import routes from './routes/routes.js'
import store from './store/index.js'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import VuePageTransition from 'vue-page-transition'

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

Vue.use(VueRouter)
Vue.use(VuePageTransition)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
