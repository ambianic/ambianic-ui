import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'

// fix for window.crypto is required bug. See #522
export const createAuthLink = async () =>
  !navigator.userAgent.includes('jsdom') &&
  (await createAuth0Client({
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    client_id: process.env.VUE_APP_AUTH0_CLIENTID,
    redirect_uri: process.env.VUE_APP_REDIRECT_URL
  }))

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

let instance

/** Returns the current instance of the SDK */
export const getInstance = () => instance

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */

export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data () {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null
      }
    },
    methods: {
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback () {
        this.loading = true
        try {
          await this.auth0Client.handleRedirectCallback()
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = true
        } catch (e) {
          this.error = e
        } finally {
          this.loading = false
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect (o) {
        return this.auth0Client.loginWithRedirect(o)
      },
      handleTestLogin () {
        this.loading = false
        this.user = {
          email: 'test@gmail.com',
          name: 'Test User'
        }
        this.isAuthenticated = true
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims (o) {
        return this.auth0Client.getIdTokenClaims(o)
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently (o) {
        return this.auth0Client.getTokenSilently(o)
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup (o) {
        return this.auth0Client.getTokenWithPopup(o)
      },
      /** Logs the user out and removes their session on the authorization server */
      logout (o) {
        return this.auth0Client.logout(o)
      }
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created () {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client({
        ...options,
        domain: process.env.VUE_APP_AUTH0_DOMAIN,
        client_id: process.env.VUE_APP_AUTH0_CLIENTID,
        redirect_uri: process.env.VUE_APP_REDIRECT_URL
      })

      try {
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback()

          this.error = null

          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(appState)
        }
      } catch (e) {
        this.error = e
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated()
        this.user = await this.auth0Client.getUser()
        this.loading = false
      }
    }
  })

  return instance
}

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  install (Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  }
}
