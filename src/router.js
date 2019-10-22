import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'Home Page',
      component: Home
    },
    {
      path: '/about',
      name: 'About Page',
      component: About
    },
    { path: '*', redirect: '/home' }
  ],
  mode: 'history'
})

export default router

/*
Vue.use(Router)

const router = new Router({
//  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/home', //      path: '/:filter',
      name: 'home',
      component: Home,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      props: true
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (['all', 'active', 'completed'].some(record => record === to.params.filter)) {
    next()
  } else {
    next('/all')
  }
})

export default router
*/
