import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import VueX from 'vuex'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import routes from '@/routes/routes.js'
import { pnpStoreModule } from '@/store/pnp'
import { myDevicesStoreModule } from '@/store/mydevices'
import { clone } from 'lodash'

describe('Routing', () => {
  // global
  let wrapper
  const localVue = createLocalVue()
  Vue.use(Vuetify) // for shallowshallowMount use
  localVue.use(VueX)
  localVue.use(VueRouter)

  const vuetify = new Vuetify()
  const router = new VueRouter({ routes })

  /** mocking IntersectionObserver
   * @global IntersectionObserver
   */
  global.IntersectionObserver = class IntersectionObserver {
    observe () {
      return null
    }

    unobserve () {
      return null
    }
  }

  beforeEach(() => {

    // mock access to IndexedDB
    myDevicesStoreModule.actions.syncState = jest.fn()

    const store = new VueX.Store({
      modules: {
        pnp: clone(pnpStoreModule),
        myDevices: clone(myDevicesStoreModule)
      }
    })

    wrapper = mount(App, {
      localVue,
      vuetify,
      router,
      stubs: ['router-view', 'router-link'],
      store
    })

  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Should navigate to Settings from App', async () => {
    wrapper.vm.$router.push('/settings')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('settings')
    expect(wrapper.vm.$router.history.current.path).toBe('/settings')
  })

  test('Should navigate to Home from App', async () => {
    wrapper.vm.$router.push('/')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('home')
    expect(wrapper.vm.$router.history.current.path).toBe('/')
  })

  test('Should navigate to Timeline from App', async () => {
    wrapper.vm.$router.push('/timeline')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('timeline')
    expect(wrapper.vm.$router.history.current.path).toBe('/timeline')
  })

  test('Should navigate to Feedback from App', async () => {
    wrapper.vm.$router.push('/feedback')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('feedback')
    expect(wrapper.vm.$router.history.current.path).toBe('/feedback')
  })

  test('Should navigate to Help from App', async () => {
    wrapper.vm.$router.push('/help')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('help')
    expect(wrapper.vm.$router.history.current.path).toBe('/help')
  })

  test('Should navigate to About from App', async () => {
    wrapper.vm.$router.push('/about')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$router.history.current.name).toBe('about')
    expect(wrapper.vm.$router.history.current.path).toBe('/about')
  })
})
