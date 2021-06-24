import { enableFetchMocks } from 'jest-fetch-mock'

import Vue from 'vue'
import { mount, createLocalVue } from '@vue/test-utils'
import VueX from 'vuex'
import moment from 'moment'
import { cloneDeep } from 'lodash'

import premium, { handleSubscriptionStatus } from '@/store/premium-service'
import Authbarmenu from '@/components/authBarMenu.vue'
import { Auth0Plugin } from '@/auth'
enableFetchMocks()

describe('AuthBarMenu', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(VueX)

  let store, state
  const methods = {}

  const CLIENTDOMAIN = process.env.VUE_APP_AUTH0_DOMAIN
  const CLIENTSECRET = process.env.VUE_APP_AUTH0_CLIENTID

  Vue.use(Auth0Plugin, {
    CLIENTDOMAIN,
    CLIENTSECRET
  })

  beforeEach(() => {
    fetch.resetMocks()

    state = {
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
  })

  afterAll(() => {
    wrapper.destroy()
  })

  test('It returns subscription object from subscription`status`', () => {
    let obj = null

    obj = handleSubscriptionStatus(
      'past_due',
      moment(new Date()).subtract(1, 'M')
    )
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Expired ${moment(new Date()).subtract(1, 'M')}`,
      shouldRenew: true
    })

    obj = handleSubscriptionStatus('canceled', moment(new Date()).add(1, 'W'))
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Active till ${moment(new Date()).add(1, 'W')}`,
      shouldRenew: false,
      canCancel: false
    })

    obj = handleSubscriptionStatus('active', moment(new Date()).add(1, 'M'))
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Expires ${moment(new Date()).add(1, 'M')}`,
      shouldRenew: false,
      canCancel: true
    })

    obj = handleSubscriptionStatus(
      'incomplete_expired',
      moment(new Date()).add(1, 'W')
    )
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Expired ${moment(new Date()).add(1, 'W')}`,
      shouldRenew: true
    })

    obj = handleSubscriptionStatus(
      'incomplete',
      moment(new Date()).add(1, 'W')
    )
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Expired ${moment(new Date()).add(1, 'W')}`,
      shouldRenew: true
    })

    obj = handleSubscriptionStatus('past_due', moment(new Date()).add(1, 'W'))
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      status: `Expired ${moment(new Date()).add(1, 'W')}`,
      shouldRenew: true
    })

    obj = handleSubscriptionStatus()
    expect(typeof obj).toBe('object')
    expect(obj).toMatchObject({
      error: 'status: undefined unrecognized'
    })
  })

  test('It fetches user subscription when "FETCH_USER_SUBSCRIPTION" is called', async () => {
    fetch.mockResponseOnce(JSON.stringify(
      {
        user_metadata: {
          userSubscriptionId: 'sub|12345678',
          userStripeId: 'cus|54231231'
        },
        sub_details: {
          current_period_end: new Date(),
          status: 'active'
        }
      }))

    const data = {
      id: 'cus|123456789'
    }

    await store.dispatch('FETCH_USER_SUBSCRIPTION', data)
    const details = store.state.premiumService.subscriptionDetails

    expect('user_metadata' in details).toBeTruthy()
    expect('sub_details' in details).toBeTruthy()
  })

  test('It sets "user" detail when "SAVE_AUTHENTICATED_USER" is called', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { stripeId: 'cus|12345678' } }))

    const data = {
      user: {
        email: 'test@mail.com',
        sub: 'auth0|12121212',
        name: 'test user'
      },
      loadingAuth: false,
      isAuthenticated: true
    }

    expect(wrapper.vm.isAuthenticated).toBe(false)
    expect(wrapper.vm.loadingAuth).toBe(true)
    expect(wrapper.vm.user).toMatchObject({})

    await store.dispatch('SAVE_AUTHENTICATED_USER', data)

    expect(wrapper.vm.user).toMatchObject(data.user)
    expect(wrapper.vm.isAuthenticated).toBeTruthy()
    expect(wrapper.vm.loadingAuth).toBe(false)
  })
})
