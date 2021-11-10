const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: 'Welcome!' },
    // component: Home
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/index.html',
    name: 'pwahome',
    meta: { title: 'Welcome!' },
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue') // Fix for PWA at /index.html
  },
  {
    path: '/timeline',
    name: 'timeline',
    meta: { title: 'Event Timeline' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "timeline" */ '../views/Timeline.vue')
  },
  // {
  // This might be connected again once we have better UX design
  //   path: '/edge-connect',
  //   name: 'edge-connect',
  //   props: true,
  //     route level code-splitting
  //     this generates a separate chunk (about.[hash].js) for this route
  //     which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "edge-connect" */ '../views/EdgeConnect.vue')
  // },
  {
    path: '/settings',
    name: 'settings',
    meta: { title: 'Settings' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/adddevice',
    name: 'adddevice',
    meta: { title: 'Add Device' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "adddevice" */ '../views/AddDevice.vue')
  },
  {
    path: '/selectdevice',
    name: 'selectdevice',
    meta: { title: 'Select Device' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "selectdevice" */ '../views/SelectDevice.vue')
  },
  {
    path: '/devicecard',
    name: 'devicecard',
    meta: { title: 'Device Card' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "devicecard" */ '../views/DeviceCard.vue')
  },
  {
    path: '/device/notifications/config',
    name: 'deviceNotificationsConfig',
    meta: { title: 'Device Notifications Config' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "deviceNotificationsConfig" */ '../views/DeviceNotificationsConfig.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    meta: { title: 'Feedback' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "feedback" */ '../views/Feedback.vue')
  },
  {
    path: '/help',
    name: 'help',
    meta: { title: 'Help' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue')
  },
  {
    path: '/about',
    name: 'about',
    meta: { title: 'About' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

export default routes
