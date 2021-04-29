import { enableFetchMocks } from 'jest-fetch-mock'

import { mount, createLocalVue } from '@vue/test-utils'
import SubscriptionDialog from '@/components/subscriptionDialog.vue'
import premium from '@/store/premium-service.js'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import { cloneDeep } from 'lodash'
enableFetchMocks()

describe('SubscriptionDialog', () => {
  let store, wrapper
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const methods = {}

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        premiumService: cloneDeep(premium)
      }
    })

    wrapper = mount(SubscriptionDialog, {
      localVue,
      store,
      methods,
      props: {
        completeSubscription: jest.fn()
      }
    })
  })

  afterAll(() => {
    wrapper.destroy()
  })

  test('Subscription Dialog is shown', () => {
    expect(wrapper.find('#subscription-dialog').exists()).toBe(true)
  })

  test('Subscription description is shown first on initial load', () => {
    expect(wrapper.find('#subscription-details').exists()).toBe(true)
    expect(wrapper.find('#inputs-ctn').exists()).toBe(false)
  })

  test('Input fields are visible for entering card details', async () => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    expect(wrapper.find('.inputs-ctn').exists()).toBe(true)

    expect(wrapper.find('#cardHolderName').exists()).toBe(true)
    expect(wrapper.find('#cardNumber').exists()).toBe(true)
    expect(wrapper.find('#emailAddress').exists()).toBe(true)
    expect(wrapper.find('#cvc').exists()).toBe(true)
    expect(wrapper.find('#expiryMonth').exists()).toBe(true)
    expect(wrapper.find('#expiryYear').exists()).toBe(true)
  })

  test('It makes a request to submit subscription data', async () => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    await wrapper.find('#confirm-btn').trigger('click')
    expect(wrapper.find('#confirm-btn').text()).toBe('Confirming Details')

    fetch.mockResponseOnce(JSON.stringify({
      userStripeId: 'cus|121212121212',
      userSubscriptionId: 'sub|121212121212'
    }))

    fetch.mockResponseOnce()
  })

  test('It handles unsuccessful subscription requests', async () => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    await wrapper.find('#confirm-btn').trigger('click')

    fetch.mockReject(new Error('Error creating subscription'))
  })
})
