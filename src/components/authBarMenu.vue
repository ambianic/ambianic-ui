<template>
  <div>
    <v-menu
      offset-y
      max-width="370px"
      right
      bottom
      :close-on-content-click="false"
      v-model="showGuide"
    >
      <template #activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="guide-ctn"
        >
          <v-tour
            :options="guideOpts"
            name="myTour"
            :steps="steps"
          >
            <template slot-scope="tour">
              <transition name="fade">
                <v-step
                  v-if="isAuthenticated && showTour"
                  :key="tour.currentStep"
                  :step="tour.steps[tour.currentStep]"
                  :previous-step="tour.previousStep"
                  :next-step="tour.nextStep"
                  :stop="tour.stop"
                  :skip="tour.skip"
                  :is-first="tour.isFirst"
                  :is-last="tour.isLast"
                  :labels="tour.labels"
                >
                  <div
                    id="tour-element-button"
                    slot="actions"
                    v-if="tour.currentStep === 0"
                  >
                    <button
                      style="border: 1px solid #fff; padding: .3rem .6rem; border-radius: 3px;"
                      id="vue-tour-button"
                      @click="setTourStatus()"
                    >
                      I Understand
                    </button>
                  </div>
                </v-step>
              </transition>
            </template>
          </v-tour>
          <div
            class="spinner"
            v-if="loadingAuth"
          >
            <v-progress-circular
              indeterminate
              :width="2.5"
              :size="30"
              color="white"
            />
          </div>
        </div>
      </template>
    </v-menu>

    <div v-if="!loadingAuth">
      <SubscriptionDialog
        id="subscription"
      />

      <EdgeAuth0Sync
        id="edgeSync"
      />

      <div
        v-if="!isAuthenticated"
        style="display: flex;"
      >
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              color="transparent"
              @click="handleAuth()"
              class="service-btn"
              data-cy="profile-component"
              v-bind="attrs"
              v-on="on"
            >
              <v-img
                src="@/assets/upgrade.png"
                alt="upgrade to premium"
                data-cy="login"
                is-icon
                style="width: 30px"
              />

              <div class="center upgrade-text">
                <p>Upgrade To Premium</p>
              </div>
            </v-btn>
          </template>
          <p> Ambianic Premium service provides Notifications and Reports </p>
        </v-tooltip>
      </div>

      <div v-else>
        <v-menu
          offset-y
          max-width="370px"
          right
          bottom
          :close-on-content-click="false"
          v-model="authMenu"
        >
          <template #activator="{ on, attrs }">
            <div
              v-on="on"
              @click="handleMenu(!authMenu)"
              data-cy="profile-toggle"
            >
              <amb-button
                is-icon
                class="user-img"
              >
                <v-avatar
                  size="32px"
                  item
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-img
                    :src="user.picture || '@/assets/user-placeholder.png'"
                    :alt="user.name"
                  />
                </v-avatar>
              </amb-button>
            </div>
          </template>

          <v-card>
            <v-list>
              <div
                id="close-menu-icon"
                style="text-align: right; padding: 0.3rem 0.5rem;"
                @click="handleMenu(false)"
              >
                <v-icon
                  class="icon"
                  right
                >
                  mdi-close
                </v-icon>
              </div>

              <v-list-item>
                <v-list-item-avatar>
                  <img
                    :src="user.picture || '@/assets/user-placeholder.png'"
                    :alt="user.name"
                    data-cy="user_avatar"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title data-cy="fullname">
                    {{ user.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle data-cy="email">
                    {{ user.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider />

            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle
                    id="title"
                    style="color: black;"
                  >
                    SUBSCRIPTION
                  </v-list-item-subtitle>
                  <br>

                  <div
                    v-if="loadingSubscription"
                    class="center"
                    style="display: flex;"
                  >
                    <v-progress-circular
                      indeterminate
                      :width="2.5"
                      :size="25"
                    />
                    <div
                      style="padding: 0 .8rem;"
                      class="center"
                    >
                      <p>Loading Subscription ...</p>
                    </div>
                  </div>

                  <div v-else>
                    <div
                      class="add-btn"
                      @click="handleSubscriptionDialog(false)"
                      v-if="!isSubscribed"
                      data-cy="add-subscription"
                    >
                      <v-icon>mdi-plus</v-icon>
                      <p style="margin: 1rem 0.3rem;">
                        Add Premium Subscription
                      </p>
                    </div>
                    <div
                      style="display: flex; justify-content: space-between;"
                      v-else
                      class="premium-subscription"
                    >
                      <v-list-item-title
                        style="margin: 0.5rem 0.3rem;"
                      >
                        Premium Subscription <br> <span
                          id="time"
                          style="color: grey; margin-top: 7px;"
                        > {{ subscriptionStatus.status }} </span>
                      </v-list-item-title>

                      <v-btn
                        v-if="subscriptionStatus.shouldRenew"
                        class="renew-btn"
                        color="primary"
                        :disabled="subscriptionStatus.canCancel"
                        style="background: #ff0033; color: #fff; margin-top: 10px;"
                        @click="renewSubscription()"
                      >
                        {{ loading ? "Renewing" : "Renew" }}
                      </v-btn>

                      <v-btn
                        v-else
                        class="subscription-btn"
                        :disabled="!subscriptionStatus.canCancel"
                        style="background: #ff0033; color: #fff; margin-top: 10px;"
                        @click="cancelSubscription()"
                      >
                        {{ loading ? "Canceling" : "Cancel" }}
                      </v-btn>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-btn
                size="3"
                class="align-center"
                style="width: 100%; padding: 0.5rem 2rem;"
                color="primary"
                data-cy="logout-button"
                id="logout-btn"
                @click="handleLogout()"
              >
                Logout

                <v-icon right>
                  mdi-logout
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  HANDLE_SUBSCRIPTION_DIALOG, HANDLE_EDGE_SYNC_DIALOG, FETCH_USER_SUBSCRIPTION
} from '@/store/action-types'
import { handleSubscriptionStatus } from '../store/premium-service'

import Moment from 'moment'

export default {
  name: 'AuthBarMenu',
  mounted: function () {
    try {
    // eslint-disable-next-line
    this.$tours['myTour'].start()
    } catch (e) { }
  },
  data: () => ({
    showGuide: true,
    authMenu: false,
    subscriptionStatus: {},
    userSubscriptionId: null,
    userStripeId: null,
    isSubscribed: false,
    showAuthenticationModal: false,
    loading: false,
    showTour: true,
    guideOpts: {
      useKeyboardNavigation: true
    },
    steps: [
      {
        target: '.guide-ctn',
        header: {
          title: 'Ambianic Guide'
        },
        content: 'Open the profile menu to view and manage your Premium subscription on your Ambianic Account'
      }
    ]
  }),
  components: {
    SubscriptionDialog: () => import('./subscriptionDialog'),
    EdgeAuth0Sync: () => import('./edge-auth0-sync')
  },
  created () {
    try {
      const syncStatus = JSON.parse(localStorage.getItem('premiumTourStatus'))
      if (syncStatus.hasTakenTour) {
        this.showTour = false
      }
    } catch (e) {
      // catch parse error
    }
  },
  methods: {
    ...mapActions([HANDLE_SUBSCRIPTION_DIALOG, HANDLE_EDGE_SYNC_DIALOG]),
    async handleSubscriptionDialog (state) {
      await this.$store.dispatch('HANDLE_SUBSCRIPTION_DIALOG', state)
    },
    renewSubscription () {
      this.loading = true

      this.$store.dispatch(HANDLE_SUBSCRIPTION_DIALOG, true)

      this.loading = false
    },
    setTourStatus () {
      localStorage.setItem('premiumTourStatus', JSON.stringify({ hasTakenTour: true }))
      this.showTour = false
    },
    async cancelSubscription () {
      this.loading = true

      await fetch(
          `${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription?userSubscriptionId=${this.userSubscriptionId}`,
          {
            method: 'DELETE',
            body: JSON.stringify({
              stripeId: this.userSubscriptionId
            }),
            headers: {
              'content-type': 'application/json'
            }
          })

      await this.$store.dispatch(FETCH_USER_SUBSCRIPTION, this.user.sub)
    },
    handleAuth () {
      this.$auth.loginWithRedirect()
    },
    setSubscriptionStatus (status, endDate) {
      this.subscriptionStatus = handleSubscriptionStatus(status, endDate)
    },
    handleLogout () {
      this.$auth.logout({
        returnTo: window.location.origin
      })
    },
    handleMenu (state) {
      this.authMenu = state
    }
  },
  computed: {
    ...mapState({
      subscriptionDetails: state => state.premiumService.subscriptionDetails,
      loadingSubscription: state => state.premiumService.loadingSubscription,
      user: state => state.premiumService.user,
      loadingAuth: state => state.premiumService.loadingAuth,
      isAuthenticated: state => state.premiumService.isAuthenticated
    })
  },
  watch: {
    subscriptionDetails: function (value) {
      if (value) {
        const { userSubscriptionId, userStripeId } = this.subscriptionDetails.user_metadata
        const { current_period_end: end, status } = this.subscriptionDetails.sub_details

        this.userSubscriptionId = userSubscriptionId
        this.userStripeId = userStripeId
        this.isSubscribed = true

        this.setSubscriptionStatus(status, Moment(end).format('ddd, MMM Do YYYY'))
        try {
          const syncStatus = JSON.parse(localStorage.getItem('edgeSyncStatus'))
          if (!syncStatus.status) {
            this.$store.dispatch(HANDLE_EDGE_SYNC_DIALOG, true)
          }
        } catch (e) {
          // new device without a previous sync record
          this.$store.dispatch(HANDLE_EDGE_SYNC_DIALOG, true)
        }
      }
    }
  }
}
</script>

<style scoped>
.add-btn {
  display: flex;
  color: grey;
  flex-direction: row;
  justify-content: center;
}

.add-btn:hover {
  cursor: pointer;
  color: #000;
}

.icon:hover {
  cursor: pointer;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}

.service-btn {
  display: flex;
  color: #fff
}

.service-btn:hover {
  cursor: pointer;
}

@media (max-width: 800px) {
  .upgrade-text {
    display: none;
  }
}

</style>
