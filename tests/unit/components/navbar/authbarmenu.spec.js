import { enableFetchMocks } from 'jest-fetch-mock'

import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import flushPromises from 'flush-promises'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import VueTour from 'vue-tour'

import premium, { handleSubscriptionStatus } from '@/store/premium-service'
import pnp from '@/store/pnp.js'
import Authbarmenu from '@/components/authBarMenu.vue'
import { Auth0Plugin } from '@/auth'
enableFetchMocks()

describe('AuthBarMenu', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(VueX)
  localVue.use(VueTour)

  let store, state
  const methods = {}

  const CLIENTDOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
  const CLIENTSECRET = process.env.VUE_APP_AUTH0_CLIENTID

  Vue.use(Auth0Plugin, {
    CLIENTDOMAIN,
    CLIENTSECRET
  })

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn()
    global.Storage.prototype.getItem = jest.fn()
    global.Storage.prototype.removeItem = jest.fn()
  })

  beforeEach(async () => {
    // fetch.resetMocks()
    localStorage.clear()

    state = {
      pnp: cloneDeep(pnp),
      premiumService: cloneDeep(premium)
    }

    store = new VueX.Store({
      modules: state
    })

    wrapper = mount(Authbarmenu, {
      localVue,
      store,
      methods
    })

    await store.dispatch('SAVE_AUTHENTICATED_USER', {
      user: {
        email: 'test@mail.com',
        sub: 'auth0|12121212',
        name: 'test user'
      },
      loadingAuth: false,
      isAuthenticated: true
    })

    fetch.mockResponseOnce({
      user_metadata: {
        userSubscriptionId: 'sub|1234567',
        userStripeId: 'cus|1234567'
      },
      sub_details: {
        current_period_end: moment(new Date()).add(1, 'M'),
        status: 'complete'
      }
    })

    await store.dispatch('FETCH_USER_SUBSCRIPTION')
  })

  afterAll(() => {
    wrapper.destroy()
  })

  test('It fetches user subscription data for new users', async () => {
    store.state.premiumService.subscriptionDetails = {
      user_metadata: {
        userSubscriptionId: 'sub|123456789',
        userStripeId: 'cus|123456789'
      },
      sub_details: {
        current_period_end: new Date(),
        status: 'active'
      }
    }

    localStorage.setItem('edgeSyncStatus', JSON.stringify({ status: false }))

    const component = mount(Authbarmenu, {
      localVue,
      store,
      methods
    })

    await component.setData({
      isSubscribed: true,
      subscriptionStatus: {
        status: `Expires ${moment(new Date()).add(1, 'M')}`,
        shouldRenew: false
      }
    })

    await flushPromises()

    expect(component.find('#title').exists()).toBe(true)

    fetch.mockResponseOnce()

    expect(component.find('#add-btn').exists()).toBe(false)
    const subscriptionElement = component.find('.premium-subscription')
    expect(subscriptionElement.exists()).toBe(true)
    expect(subscriptionElement.contains('#time ')).toBe(true)

    const button = component.find('.subscription-btn')

    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Cancel')
  })

  test('It fetches user subscription data for old users', async () => {
    store.state.premiumService.subscriptionDetails = {
      user_metadata: {
        userSubscriptionId: 'sub|12345678',
        userStripeId: 'cus|54231231'
      },
      sub_details: {
        current_period_end: new Date(),
        status: 'active'
      }
    }

    localStorage.setItem('edgeSyncStatus', 'true')

    const newComponent = mount(Authbarmenu, {
      localVue,
      store,
      methods
    })

    await newComponent.setData({
      isSubscribed: true,
      subscriptionStatus: {
        status: `Expires ${moment(new Date()).add(1, 'M')}`,
        shouldRenew: false
      }
    })

    await flushPromises()

    fetch.mockResponseOnce()
  })

  test('It handles renewal of expired subscriptions', async () => {
    await wrapper.setData({
      isSubscribed: true,
      subscriptionStatus: {
        status: `Expired on ${moment(new Date()).subtract(1, 'M')}`,
        shouldRenew: true
      }
    })

    await flushPromises()
    const renewBtn = wrapper.find('.renew-btn')
    expect(renewBtn.exists()).toBe(true)

    await renewBtn.trigger('click')

    await flushPromises()
    setTimeout(() => {
      expect(wrapper.find('#subscription').exists()).toBe(true)
    }, 1500)
  })

  test('Close icon toggles menu state', async () => {
    await wrapper.find('#close-menu-icon').trigger('click')
  })

  test('It makes request to cancel subscription', async () => {
    await wrapper.setData({
      isSubscribed: true,
      subscriptionStatus: handleSubscriptionStatus(
        'active',
        moment(new Date()).add(1, 'M')
      )
    })

    await flushPromises()

    expect(wrapper.find('.subscription-btn').text()).toBe('Cancel')
    await wrapper.find('.subscription-btn').trigger('click')
    await wrapper.find('#logout-btn').trigger('click')

    fetch.mockResponseOnce()
  })
})
