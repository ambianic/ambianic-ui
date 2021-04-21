import { mount, createLocalVue } from '@vue/test-utils'
import SubscriptionDialog from '../../../src/components/subscriptionDialog.vue'
import Vuex from 'vuex'
import moxios from 'moxios'
import flushPromises from 'flush-promises'

describe('SubscriptionDialog', () => {
  let state, store, wrapper
  const localVue = createLocalVue()
  localVue.use(Vuex)

  beforeEach(() => {
    moxios.install()

    state = {}

    store = new Vuex.Store({ state })

    wrapper = mount(SubscriptionDialog, {
      store
    })
  })

  afterAll(() => {
    moxios.uninstall()
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

  test('It makes a request to submit subscription data', async (done) => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    await wrapper.find('#confirm-btn').trigger('click')
    expect(wrapper.find('#confirm-btn').text()).toBe('Confirming Details')

    moxios.stubRequest('/subscribe')

    moxios.wait(async () => {
      const subRequest = moxios.requests.mostRecent()

      try {
        await subRequest.respondWith({
          status: 200,
          response: {
            userStripeId: 'cus|121212121212',
            userSubscriptionId: 'sub|121212121212'
          }
        })

        done()
      } catch (e) {
        console.debug(`Error fetching request: ${e}`)
      }
    })
  })

  test('It handles unsuccessful subscription requests', async (done) => {
    await wrapper.setData({ showInputs: true })

    await flushPromises()

    await wrapper.find('#confirm-btn').trigger('click')

    moxios.stubRequest('/subscribe')

    moxios.wait(async () => {
      const subRequest = moxios.requests.mostRecent()

      try {
        await subRequest.respondWith({ status: 422 })
        const errorElement = wrapper.find('#error')

        expect(errorElement.exists()).toBe(true)
        expect(errorElement.contains('p')).toBe(true)
        done()
      } catch (e) {
        console.debug(`Error fetching request: ${e}`)
      }
    })
  })
})
