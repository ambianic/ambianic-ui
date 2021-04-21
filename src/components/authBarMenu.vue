<template>
  <div>
    <div
      class="spinner"
      @click="handleMock()"
      v-if="$auth.loading"
    >
      <v-progress-circular
        indeterminate
        :width="2.5"
        :size="30"
        color="white"
      />
    </div>

    <div v-else>
      <SubscriptionDialog
        id="subscription"
        v-if="showSubscription"
        :complete-subscription="() => handleCompletedSubscription()"
        :email="isSubscribed ? this.$auth.user.email : 'test@gmail.com'"
      />

      <EdgeAuth0Sync
        id="edgeSync"
        v-if="showEdgeSync"
      />

      <div
        v-if="!$auth.isAuthenticated"
        style="display: flex;"
      >
        <button
          data-cy="auth-btn"
          style="opacity: 0; color: white;"
          @click="showSubscription = true"
        >
          .
        </button>
        <button
          data-cy="display-profile"
          style="opacity: 0;"
          @click="$auth.handleTestLogin()"
        >
          a
        </button>
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
              <v-icon
                data-cy="login"
                is-icon
              >
                mdi-plus
              </v-icon>

              <div class="center">
                <p>Premium Service</p>
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
              <amb-button is-icon>
                <v-avatar
                  size="32px"
                  item
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-img
                    :src="$auth.user.picture || '@/assets/user-placeholder.png'"
                    :alt="$auth.user.name || user.name"
                  />
                </v-avatar>
              </amb-button>
            </div>
          </template>

          <v-card>
            <v-list>
              <div
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
                    :src="$auth.user.picture || '@/assets/user-placeholder.png'"
                    :alt="$auth.user.name || user.name"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ $auth.user.name || user.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $auth.user.email || user.email }}
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
                    class="add-btn"
                    @click="showSubscription = true"
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
import Axios from 'axios'
import { mapState } from 'vuex'
import {
  PEER_CONNECTED
} from '@/store/mutation-types'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

export default {
  name: 'AuthBarMenu',
  data: () => ({
    user: null,
    authMenu: false,
    isAuthenticated: false,
    showSubscription: false,
    subscriptionStatus: {},
    userSubscriptionId: null,
    userStripeId: null,
    isSubscribed: false,
    showAuthenticationModal: false,
    showEdgeSync: false,
    loading: false
  }),
  components: {
    AmbButton: () => import('./shared/Button.vue'),
    SubscriptionDialog: () => import('./subscriptionDialog'),
    EdgeAuth0Sync: () => import('./edge-auth0-sync')
  },
  async created () {
    // waits for the auth0 client to be fully loaded
    // setTimeout(() => {
    if (this.$auth.isAuthenticated) {
      this.fetchStripeId()
    }
    // }, 1500)
  },
  methods: {
    renewSubscription () {
      this.loading = true
      this.showSubscription = true
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)
    },
    handleCompletedSubscription () {
      this.fetchStripeId()
      this.showEdgeSync = true
    },
    cancelSubscription () {
      this.loading = true
      Axios.delete(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription?userSubscriptionId=${this.userSubscriptionId}`,
        {
          data: {
            stripeId: this.userSubscriptionId
          },
          headers: {
            'content-type': 'application/json'
          }
        }
      )
        .then(() => {
          this.fetchStripeId()
        })
        .catch((e) => {
          console.log('ERROR UNSUBSCRIBING', e)
        })
    },
    handleAuth () {
      this.$auth.loginWithRedirect()
    },
    async fetchStripeId () {
      try {
        const { data } = await Axios.get(
        `${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription-data?userId=${this.$auth.user.sub}`
        )

        const { userSubscriptionId, userStripeId } = data.user_metadata
        const { current_period_end: end, status } = data.sub_details

        this.userSubscriptionId = userSubscriptionId
        this.userStripeId = userStripeId
        this.isSubscribed = true

        this.handleSubscriptionStatus(status, moment(end).format('ddd, MMM Do YYYY'))

        try {
          const syncStatus = JSON.parse(localStorage.getItem('edgeSyncStatus'))

          if (!syncStatus.status) {
            this.showEdgeSync = true
          }
        } catch (e) {
          // new device without a previous sync record
          this.showEdgeSync = true
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleSubscriptionStatus (status, endDate) {
      console.log(`Recieved Status : ${status} \n \n \n \n \n \n`)

      switch (status) {
        case 'past_due':
          this.subscriptionStatus = { status: `Expired ${endDate}`, shouldRenew: true }
          break

        case 'active':
          this.subscriptionStatus = { status: `Expires ${endDate}`, shouldRenew: false, canCancel: true }
          break

        case 'incomplete_expired':
          this.subscriptionStatus = { status: `Expired ${endDate}`, shouldRenew: true }
          break

        case 'canceled':
          this.subscriptionStatus = { status: `Active till ${endDate}`, shouldRenew: false, canCancel: false }
          break

        default:
          break
      }
    },
    handleLogout () {
      this.$auth.logout({
        returnTo: window.location.origin
      })
    },
    handleMenu (state) {
      this.authMenu = state
    },
    handleMock () {
      this.$auth.handleTestLogin()
    }
  },
  computed: {
    ...mapState({
      isEdgeConnected: state =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED
    })
  },
  watch: {
    isEdgeConnected: function (value) {
      if (value && this.$auth.user) {
        this.fetchStripeId()
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

</style>
