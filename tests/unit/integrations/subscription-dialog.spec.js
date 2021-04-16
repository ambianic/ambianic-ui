import { mount, createLocalVue } from '@vue/test-utils'
import SubscriptionDialog from '../../../src/components/subscriptionDialog.vue'
import Vuex from 'vuex'

describe('SubscriptionDialog', () => {
  let state, store, wrapper
  const localVue = createLocalVue()
  localVue.use(Vuex)

  beforeEach(() => {
    state = {}

    store = new Vuex.Store({ state })

    wrapper = mount(SubscriptionDialog, {
      store
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  test('Subscription Dialog is shown', () => {
    expect(wrapper.find('#subscription-dialog').exists()).toBe(true)
  })

  test('Subscription description is shown first on initial load', () => {
    expect(wrapper.find('#subscription-details').exists()).toBe(true)
  })

  test('Input fields are visible for entering card details', async () => {
    await wrapper.setData({ showInputs: true })

    expect(wrapper.find('#cardHolderName').exists()).toBe(true)
    expect(wrapper.find('#cardNumber').exists()).toBe(true)
    expect(wrapper.find('#emailAddress').exists()).toBe(true)
    expect(wrapper.find('#cvc').exists()).toBe(true)
    expect(wrapper.find('#expiryMonth').exists()).toBe(true)
    expect(wrapper.find('#expiryYear').exists()).toBe(true)
  })
})
