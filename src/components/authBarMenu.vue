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
        :complete-subscription="() => fetchCustomers() "
        :email="isSubscribed ? this.user.email : 'test@gmail.com'"
      />
      <div
        v-if="!$auth.isAuthenticated"
        style="display: flex"
      >
        <!-- Cypress cant test Netlify forms as it's injected into the DOM. This manually sets the Auth state-->
        <button
          data-cy="auth-btn"
          style="opacity: 0; color: white"
          @click="showSubscription= true"
        >
          .
        </button>
        <button
          data-cy="display-profile"
          style="opacity: 0;"
          @click="$auth.handleTestLogin()"
        >
          .aa
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
              <amb-button
                is-icon
              >
                <v-avatar
                  size="32px"
                  item
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-img
                    src="@/assets/user-placeholder.png"
                    :alt="$auth.user.name || user.name"
                  />
                </v-avatar>
              </amb-button>
            </div>
          </template>

          <v-card>
            <v-list>
              <div
                style="text-align: right; padding: .3rem .5rem;"
                @click="handleMenu(false)"
              >
                <v-icon right>
                  mdi-close
                </v-icon>
              </div>

              <v-list-item>
                <v-list-item-avatar>
                  <img
                    src="@/assets/user-placeholder.png"
                    :alt="$auth.user.name || user.name"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ $auth.user.name || user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ $auth.user.email || user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider />

            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle style="color: black">
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
                    <p style="margin: 1rem .3rem">
                      Add Premium Subscription
                    </p>
                  </div>
                  <div
                    style="display: flex; justify-content: space-between"
                    v-else
                  >
                    <v-list-item-title style="margin: .5rem .3rem; color: grey">
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

export default {
  name: 'AuthBarMenu',
  data: () => ({
    user: null,
    authMenu: false,
    isAuthenticated: false,
    showSubscription: false,
    stripeId: null,
    text: 'Something here',
    isSubscribed: false,
    showAuthenticationModal: false
  }),
  components: {
    AmbButton: () => import('./shared/Button.vue'),
    SubscriptionDialog: () => import('./subscriptionDialog')
  },
  created () {
    if (this.$auth.isAuthenticated) {
      this.fetchCustomers()
    }
  },
  methods: {
    cancelSubscription () {
      Axios.post(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/cancelSubscription?stripeId=${this.stripeId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          this.isSubscribed = false
        }).catch(e => {
          console.log('ERROR UNSUBSCRIBING')
        })
    },
    handleAuth () {
      this.$auth.loginWithRedirect()
    },
    findUserSubscription ({ customers }) {
      const subscription = customers.data.find(({ email }) =>
        email.toLocaleLowerCase() === this.$auth.user ? this.$auth.user.email.toLocaleLowerCase() : this.user.email
      )

      if (subscription) {
        this.stripeId = subscription.id
        this.isSubscribed = true
      }
    },
    fetchCustomers () {
      Axios.get(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/getCustomers`)
        .then(({ data }) => this.findUserSubscription(data))
        .catch(e => {
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
    },
    completeAuth (user) {
      this.user = user
      this.isAuthenticated = true
    }
  },
  watch: {
    isAuthenticated: function (value) {
      if (value) {
        this.fetchCustomers()
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
  justify-content: center
}

.add-btn:hover {
  cursor: pointer;
  color: #000;
}
</style>
