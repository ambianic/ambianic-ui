<template>
  <v-dialog
    id="dialog"
    v-model="showModal"
    max-width="550"
  >
    <v-card
      id="pending"
      v-if="syncState === 'PENDING'"
    >
      <div class="container">
        <h2 style="font-weight: normal;">
          Ambianic Edge Device
        </h2>
        <hr>
        <p>To securely authenticate with your running Edge Device;</p>
        <v-list>
          <v-list-item>
            <p>
              On your computer or mobile device browser, go to:
              <a
                id="verification_url"
                target="_blank"
                :href="verification_url"
              >
                Edge Device Activation Page
              </a>
            </p>
          </v-list-item>
          <v-list-item>
            <p>
              Confirm the following code shown:
              <span class="code" id="verification_code" >{{ user_code }}</span>
            </p>
          </v-list-item>
        </v-list>
        <hr>
        <div class="flex">
          <p style="margin-right: 10px;">
            Waiting for confirmation
          </p>
          <v-progress-circular
            id="spinner"
            indeterminate
            :width="2.5"
            :size="20"
            color="primary"
          />
        </div>
      </div>
    </v-card>

    <v-card
      id="granted"
      v-else-if="syncState === 'GRANTED'"
    >
      <div class="container">
        <h2 style="font-weight: normal;">
          Ambianic Edge Device
        </h2>
        <hr>
        <div style="margin: 1rem 0;">
          <v-icon
            style="margin: 0.5rem 0;"
            center
            size="50"
          >
            mdi-check-circle-outline
          </v-icon>
          <p>Ambianic Edge Device Authenticated Successfully!</p>
        </div>
        <div>
          <v-btn
            color="primary"
            id="dismiss-button"
            @click="showModal = false"
          >
            OK, Close and Continue
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import Axios from 'axios'
import Request from 'axios-request-handler'

export default {
  name: 'EdgeAuth0Sync',
  isLoading: true,
  data: (_) => ({
    showModal: true,
    syncState: 'PENDING',
    verification_url: '',
    user_code: '',
    device_code: ''
  }),
  created () {
    Axios.post(
      'https://8778-coral-cougar-28utrusj.ws-eu03.gitpod.io/api/auth/get-user-code',
      {
        client_id: process.env.VUE_APP_EDGE_AUTH0_CLIENTID,
        domain: process.env.VUE_APP_EDGE_AUTH0_DOMAIN
      }
    )
      .then(({ data }) => {
        this.verification_url = data.verification_uri_complete
        this.user_code = data.user_code
        this.device_code = data.device_code

        this.checkStatus()
      })
      .catch((e) => console.log(e))
  },
  methods: {
    checkStatus () {
      const authRequest = new Request(
        'https://8778-coral-cougar-28utrusj.ws-eu03.gitpod.io/api/auth/verify-token',
        {
          params: {
            device_code: this.device_code
          },
          lockable: false
        }
      )

      authRequest.poll(6500).post(({ data }) => {
        if (data.access_token) {
          this.syncState = 'GRANTED'

          this.saveToken(data.access_token)
          return false
        }
      })
    },

    saveToken (token) {
      Axios.post(
            `https://8778-coral-cougar-28utrusj.ws-eu03.gitpod.io/api/auth/save-token?access_token=${token}`
      ).catch(e => console.log('error saving token: e'))
    }
  }
}
</script>

<style scoped>
.container {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.flex {
  display: flex;
  justify-content: center;
}
</style>
