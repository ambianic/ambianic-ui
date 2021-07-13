import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import './registerServiceWorker'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL
})

Vue.use(VueRouter)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (window.Cypress) {
  window.__store__ = store
}
