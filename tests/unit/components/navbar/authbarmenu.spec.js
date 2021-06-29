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

  const CLIENT_DOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
  const CLIENT_SECRET = process.env.VUE_APP_AUTH0_CLIENTID

  Vue.use(Auth0Plugin, {
    CLIENT_DOMAIN,
    CLIENT_SECRET
  })

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn()
    global.Storage.prototype.getItem = jest.fn()
    global.Storage.prototype.removeItem = jest.fn()
  })

  beforeEach(async () => {
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

  test('It fetches user subscription data for new created users', async () => {
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

    expect(component.find('#add-btn').exists()).toBe(false)
    const subscriptionElement = component.find('.premium-subscription')
    expect(subscriptionElement.exists()).toBe(true)
    expect(subscriptionElement.contains('#time ')).toBe(true)

    const button = component.find('.cancel-subscription-btn')

    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Cancel')

    wrapper.vm.setSubscriptionStatus('active', moment(new Date()).add('1', 'M'))
  })

  test('Edge Sync modal is shown for user without `edgeSync` record', async () => {
    store.state.premiumService.subscriptionDetails = {
      user_metadata: {
        userSubscriptionId: 'sub|55555555',
        userStripeId: 'cus|55555555'
      },
      sub_details: {
        current_period_end: new Date(),
        status: 'active'
      }
    }

    localStorage.setItem('edgeSyncStatus', null)

    mount(Authbarmenu, {
      localVue,
      store,
      methods
    })

    expect(wrapper.find('.sync-container').isVisible()).toBe(true)
  })

  test('`setTourStatus` method sets tour record and closes tour component', async () => {
    localStorage.setItem('premiumTourStatus', JSON.stringify({ hasTakenTour: true }))

    const component = mount(Authbarmenu, {
      localVue,
      store,
      methods
    })

    component.vm.setTourStatus()

    const tourStatus = JSON.parse(localStorage.getItem('premiumTourStatus'))

    expect(tourStatus.hasTakenTour).toBeTrue()
    expect(wrapper.find('#tour-element-button').exists()).toBe(false)
  })

  test('`subscription` details is retrieved from `premium` store', async () => {
    const mockSubData = {
      user_metadata: {
        userSubscriptionId: 'sub|555555555555',
        userStripeId: 'cus|5555555555555'
      }
    }

    store.state.premiumService.subscriptionDetails = mockSubData

    localStorage.setItem('edgeSyncStatus', JSON.stringify({ status: true }))

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
    expect(wrapper.vm.subscriptionDetails.user_metadata.userStripeId).toBe(mockSubData.user_metadata.userStripeId)
  })

  test('It fetches user subscription data for returning users', async () => {
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

  test('Renewal button is shown for expired subscriptions', async () => {
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

  test('`handleMenu` method toggles authBar visibility', async () => {
    // close dialog
    wrapper.vm.handleMenu(false)
    expect(wrapper.find('#close-menu-icon').isVisible()).toBe(true)

    // (re)open dialog
    wrapper.vm.handleMenu(true)
    expect(wrapper.find('#close-menu-icon').isVisible()).toBe(true)
  })

  test('It makes a request to cancel subscription', async () => {
    fetch.mockResponseOnce(JSON.stringify(
      {
        user_metadata: null,
        sub_details: null
      }))

    store.state.premiumService.user.id = 'auth0|12345678'

    await wrapper.setData({
      isSubscribed: true,
      subscriptionStatus: handleSubscriptionStatus(
        'active',
        moment(new Date()).add(1, 'M')
      )
    })

    await flushPromises()

    expect(wrapper.find('.cancel-subscription-btn').text()).toBe('Cancel')
    await wrapper.find('.cancel-subscription-btn').trigger('click')

    expect(store.state.premiumService.subscriptionDetails).toBe(null)
  })

  test('`handleAuth` method initiates user login', async () => {
    const mock = jest.fn()

    wrapper.vm.$auth = {
      loginWithRedirect () {
        return mock()
      }
    }

    wrapper.vm.handleAuth()

    await flushPromises()
    expect(mock).toHaveBeenCalled()
  })
})
