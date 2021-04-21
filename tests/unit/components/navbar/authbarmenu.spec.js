import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import VueX from "vuex";
import Authbarmenu from "@/components/authBarMenu.vue";
import { Auth0Plugin } from "@/auth";
import flushPromises from "flush-promises";
import moxios from "moxios";
import moment from "moment";

describe("AuthBarMenu", () => {
  // global
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueX);

  let store, state;

  const CLIENTDOMAIN = process.env.VUE_APP_AUTH0_DOMAIN;
  const CLIENTSECRET = process.env.VUE_APP_AUTH0_CLIENTID;

  // AUTH0 PLUGIN
  Vue.use(Auth0Plugin, {
    CLIENTDOMAIN,
    CLIENTSECRET,
  });

  beforeEach(() => {
    moxios.install();

    state = {
      pnp: {
        peerConnectionStatus: jest.fn(),
      },
    };

    store = new VueX.Store({
      state,
    });

    // using shallowMount with subtree components
    wrapper = mount(Authbarmenu, {
      localVue,
      store,
    });
  });

  afterAll(() => {
    moxios.uninstall();

    wrapper.destroy();
  });

  test("It displays loading authentication spinner", () => {
    expect(wrapper.find(".spinner").exists()).toBe(true);
  });

  test("It displays EdgeSync and Subscription Modals", async () => {
    await wrapper.setData({
      showSubscription: true,
      showEdgeSync: true,
    });

    await wrapper.find(".spinner").trigger("click");

    await flushPromises();

    expect(wrapper.find("#subscription").exists()).toBe(true);
    expect(wrapper.find("#edgeSync").exists()).toBe(true);
  });

  test("It fetches user subscription data", async (done) => {
    expect(wrapper.find("#title").exists()).toBe(true);

    moxios.stubRequest("/subscription-data?userId=auth0|121212121212");

    moxios.wait(async () => {
      const req = moxios.requests.mostRecent();

      try {
        await req.respondWith({
          status: 200,
          response: {
            user_metadata: {
              userSubscriptionId: "sub|121212121212",
              userStripeId: "cus|121212121212",
            },
            sub_details: {
              current_period_end: moment(new Date()).add(1, "M"),
              status: "active",
            },
          },
        });

        expect(wrapper.find("#add-btn").exists()).toBe(false);
        const subscriptionElement = wrapper.find(".premium-subscription");
        expect(subscriptionElement.exists()).toBe(true);
        expect(subscriptionElement.contains("#time ")).toBe(true);

        const button = wrapper.find(".subscription-btn");

        expect(button.exists()).toBe(true);
        expect(button.text()).toBe("Cancel");

        done();
      } catch (e) {
        console.debug(`FAILED TO RESPOND: ${e}`);
      }
    });
  });

  test("It makes request to cancel subscription", async (done) => {
    await wrapper.setData({
      isSubscribed: true,
    });

    await wrapper.find(".subscription-btn").trigger("click");
    expect(wrapper.find(".subscription-btn").text()).toBe("Canceling");

    moxios.stubRequest("/subscription?userSubscriptionId=sub|121212121212");

    moxios.wait(async () => {
      const cancelRequest = moxios.requests.mostRecent();

      try {
        await cancelRequest.respondWith({ status: 200 });

        done();
      } catch (e) {
        console.debug(`FAILED TO RESPOND: ${e}`);
      }
    });
  });

  test("It displays a renew button for expired subscription status", async () => {
    await wrapper.setData({
      isSubscribed: true,
      subscriptionStatus: {
        shouldRenew : true,
      }
    })
    
    await flushPromises()
    const renewBtn = wrapper.find('.renew-btn') 
    expect(renewBtn.exists()).toBe(true)

    await renewBtn.trigger('click')
    expect(renewBtn.text()).toBe("Renewing")
  })
});
