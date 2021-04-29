import { enableFetchMocks } from 'jest-fetch-mock'

import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import flushPromises from 'flush-promises'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import VueTour from 'vue-tour'

import premium, { handleSubscriptionStatus } from '@/store/premium-service'
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

  beforeEach(async () => {
    fetch.resetMocks()

    state = {
      pnp: {
        peerConnectionStatus: jest.fn()
      },
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
  })

  afterAll(() => {
    wrapper.destroy()
  })

  test('It fetches user subscription data', async () => {
    await wrapper.setData({
      isSubscribed: true,
      subscriptionStatus: {
        status: `Expires ${moment(new Date()).add(1, 'M')}`,
        shouldRenew: false
      }
    })

    await flushPromises()

    expect(wrapper.find('#title').exists()).toBe(true)

    fetch.mockResponseOnce()

    expect(wrapper.find('#add-btn').exists()).toBe(false)
    const subscriptionElement = wrapper.find('.premium-subscription')
    expect(subscriptionElement.exists()).toBe(true)
    expect(subscriptionElement.contains('#time ')).toBe(true)

    const button = wrapper.find('.subscription-btn')

    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Cancel')
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

    // expect(methods.renewSubscription).toHaveBeenCalled()
    await flushPromises()
    setTimeout(() => {
      expect(wrapper.find('#subscription').exists()).toBe(true)
    }, 1500)
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

    fetch.mockResponseOnce()
  })
})
