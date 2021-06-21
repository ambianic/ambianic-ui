import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'
import { store } from '@/store'
import { mapActions } from 'vuex'
import {
  FETCH_USER_SUBSCRIPTION
} from '@/store/action-types'

// fix for window.crypto is required bug. See #522
export const createAuthLink = async () =>
  !navigator.userAgent.includes('jsdom') &&
  (await createAuth0Client({
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    client_id: process.env.VUE_APP_AUTH0_CLIENTID,
    redirect_uri: process.env.VUE_APP_REDIRECT_URL
  }))

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

let instance

export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = window.location.origin,
  user = {},
  ...options
}) => {
  if (instance) return instance

  instance = new Vue({
    store,
    data: () => ({
      auth0Client: null
    }),
    methods: {
      ...mapActions([FETCH_USER_SUBSCRIPTION]),
      async handleRedirectCallback () {
        this.loading = true
        try {
          await this.auth0Client.handleRedirectCallback()

          const user = await this.auth0Client.getUser()
          this.$store.dispatch('SAVE_AUTHENTICATED_USER', {
            user,
            loadingAuth: false,
            isAuthenticated: true
          })

          this.$store.dispatch(FETCH_USER_SUBSCRIPTION, user.sub)
        } catch (e) {
          this.error = e

          this.$store.dispatch('SAVE_AUTHENTICATED_USER', {
            user: null,
            loadingAuth: false,
            isAuthenticated: false
          })
        } finally {
          this.loading = false
        }
      },
      loginWithRedirect (o) {
        return this.auth0Client.loginWithRedirect(o)
      },
      logout (o) {
        this.$store.dispatch('SAVE_AUTHENTICATED_USER', {
          user: null,
          loadingAuth: false,
          isAuthenticated: false
        })

        return this.auth0Client.logout(o)
      },
      async authenticateUser () {
        try {
          if (
            window.location.search.includes('code=') &&
              window.location.search.includes('state=')
          ) {
            console.log('HANDLE REDIRECT CALLBACK')
            console.log(window.history)
            const { appState } = await this.auth0Client.handleRedirectCallback()
            this.error = null
            onRedirectCallback(appState)
          }
        } catch (e) {
          this.error = e
        } finally {
          if (this.auth0Client) {
            this.isAuthenticated = await this.auth0Client.isAuthenticated()

            const user = await this.auth0Client.getUser()

            this.$store.dispatch('SAVE_AUTHENTICATED_USER', {
              user,
              loadingAuth: false,
              isAuthenticated: user && true
            })

            this.$store.dispatch('FETCH_USER_SUBSCRIPTION', user.sub)
          } else {
            console.log(`Auth0 Client is: ${this.auth0Client}`)
          }
        }
      }
    },
    async created () {
      try {
        this.auth0Client = await createAuth0Client({
          ...options,
          domain: process.env.VUE_APP_AUTH0_DOMAIN,
          client_id: process.env.VUE_APP_AUTH0_CLIENTID,
          redirect_uri: process.env.VUE_APP_REDIRECT_URL
        })
      } catch (e) {
        console.log('Unable to create auth0Client')
      } finally {
        this.authenticateUser()
      }
    }
  })

  return instance
}

export const Auth0Plugin = {
  install (Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  }
}
