<template>
  <div>
    <div v-if="$auth.loading">
      <v-progress-circular
        indeterminate
        :width="2.5"
        :size="30"
        color="white"
      />
    </div>

    <div v-else>
      <SubscriptionDialog
        v-if="showSubscription"
        :complete-subscription="() => handleCompletedSubscription()"
        :email="isSubscribed ? this.$auth.user.email : 'test@gmail.com'"
      />

      <EdgeAuth0Sync v-if="showEdgeSync" />
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
        <!--      -->
        <div
          @click="handleAuth()"
          data-cy="profile-component"
        >
          <amb-button
            with-badge
            data-cy="login"
            is-icon
            icon="login"
          />
        </div>
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
                <v-icon right>
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
                  <v-list-item-subtitle style="color: black;">
                    CURRENT SUBSCRIPTION
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
                  >
                    <v-list-item-title
                      style="margin: 0.5rem 0.3rem; color: grey;"
                    >
                      Premium Subscription
                    </v-list-item-title>

                    <v-btn @click="cancelSubscription()">
                      Cancel
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
    userSubscriptionId: null,
    userStripeId: null,
    isSubscribed: false,
    showAuthenticationModal: false,
    showEdgeSync: false
  }),
  components: {
    AmbButton: () => import('./shared/Button.vue'),
    SubscriptionDialog: () => import('./subscriptionDialog'),
    EdgeAuth0Sync: () => import('./edge-auth0-sync')
  },
  async created () {
    // waits for the auth0 client to be fully loaded
    setTimeout(() => {
      if (this.$auth.user.sub) {
        this.fetchStripeId()
      }
    }, 1500)
  },
  methods: {
    handleCompletedSubscription () {
      this.fetchStripeId()
      this.showEdgeSync = true
    },
    cancelSubscription () {
      Axios.delete(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription?stripeId=${this.userSubscriptionId}`,
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
          this.removeStripeId()
        })
        .catch((e) => {
          console.log('ERROR UNSUBSCRIBING', e)
        })
    },
    removeStripeId () {
      Axios.post(
        `${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription-data`,
        {
          user_id: this.$auth.user.sub,
          userStripeId: this.userStripeId
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
        .then(() => {
          this.isSubscribed = false
          localStorage.setItem('edgeSyncStatus', JSON.stringify({ isSynced: false }))
        })
        .catch((error) => {
          console.log(error, 'error saving stripeid')
          this.isSubscribed = false
        })
    },
    handleAuth () {
      this.$auth.loginWithRedirect()
    },
    fetchStripeId () {
      Axios.get(
        `${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription-data?userId=${this.$auth.user.sub}`
      )
        .then(({ data }) => {
          const { userSubscriptionId, userStripeId, duration } = data.user.user_metadata
          const today = Moment(new Date())

          const subscriptionRange = moment.range(duration.start_date, duration.end_date)
          const isActive = subscriptionRange.contains(today)

          if (isActive) {
            this.userSubscriptionId = userSubscriptionId
            this.userStripeId = userStripeId
            this.isSubscribed = true

            try {
              const syncStatus = JSON.parse(localStorage.getItem('edgeSyncStatus'))

              if (!syncStatus.isSynced) {
                this.showEdgeSync = true
              }
            } catch (e) {
              // new device without a previous sync record
              this.showEdgeSync = true
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
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
</style>
