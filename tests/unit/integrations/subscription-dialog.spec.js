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

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        premiumService: cloneDeep(premium)
      }
    })

    wrapper = mount(SubscriptionDialog, {
      localVue,
      store,
      props: {
        completeSubscription: jest.fn()
      }
    })
  })

  afterAll(() => {
    wrapper.destroy()
  })

  test('`handleSubscriptionDialog` toggles Subscription modal visibility', () => {
    // close modal
    wrapper.vm.handleSubscriptionDialog(false)
    expect(wrapper.find('#subscription-dialog').exists())

    // (re)open dialog
    wrapper.vm.handleSubscriptionDialog(true)
    expect(wrapper.find('#subscription-dialog').exists()).toBe(true)
  })

  test('Subscription description is shown first on initial load before text fields', () => {
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

  test('Credit Card Regex validator is functional', async () => {
    // correct Stripe test card
    await wrapper.setData({
      cardNumber: '4242424242424242'
    })

    expect(wrapper.vm.cardNumberIsValid).toBeTruthy()

    await wrapper.setData({
      cardNumber: '12345678901'
    })

    expect(wrapper.vm.cardNumberIsValid).toBe(false)

    wrapper.setData({
      rules: {
        required: true
      }
    })
  })

  test('Error text response is shown for unsuccessful subscription requests', async () => {
    fetch.mockResponseOnce(
          JSON.stringify({error: 'Error creating subscription'} ), { status: 404}
    )

    await wrapper.setData({ showInputs: true })
    await flushPromises()
    await wrapper.find('#confirm-btn').trigger('click')

    await flushPromises()

    expect(wrapper.find('.error-text').exists()).toBe(true)
    expect(wrapper.find('#subscription-spinner').exists()).toBe(false)
  })

  test('Request is made to submit subscription data at `Confirm` button click', async () => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    await wrapper.find('#confirm-btn').trigger('click')
    expect(wrapper.find('#confirm-btn').text()).toBe('Confirming Details')

    fetch.mockResponseOnce(JSON.stringify({
      userStripeId: 'cus|121212121212',
      userSubscriptionId: 'sub|121212121212'
    }), { status: 200})

    fetch.mockResponseOnce()
  })

  test('`saveStripeData` executes request to save user data and closes subscription dialog', async () => {
    fetch.mockResponseOnce(
        JSON.stringify({
          userStripeId: 'cus|121212121212',
          userSubscriptionId: 'sub|121212121212'
        } ), { statusCode: 200}
    )

    await wrapper.vm.saveStripeData()
    expect(wrapper.vm.loading).toBe(false)

    // saveSubscription method mutates values in premiumService
    expect(store.state.premiumService.showSubscriptionDialog).toBe(false)
  })
})
