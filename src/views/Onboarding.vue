<template>
  <div class="body">
    <v-dialog
      v-model="sendRequestDialog"
      width="500"
      data-cy="messaging-option-modal"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <h5 class="title">
            Messaging Client
          </h5>
        </v-card-title>
        <br>

        <p align="center">
          Select a messaging client below;
        </p>
        <ul>
          <!-- For cypress test runner only -->
          <div
            data-cy="select-client"
            style="opacity: 0;"
            @click="handleAccessRequest(true)"
          >
            <p>A hidden item</p>
          </div>
          <!-- end -->

          <li
            v-for="client in MESSAGE_CLIENTS"
            :key="client.name"
            class="list-item"
          >
            <div @click="handleAccessRequest(true, client.name)">
              <a
                :href="client.content"
                style="text-decoration: none; padding-top: 10px;"
              >
                <v-icon left>mdi-{{ client.icon }}</v-icon>
                {{ client.name }}
              </a>
            </div>
          </li>
        </ul>
        <br>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="handleRequestDialog(false)"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="container">
      <v-card
        data-cy="installationCard"
        max-width="800"
        class="mx-auto"
      >
        <v-list-item justify="center">
          <v-list-item-content>
            <nav style="display: flex; flex-direction: row;">
              <v-list-item-title class="headline">
                <h5>Getting Started</h5>
              </v-list-item-title>

              <div
                v-if="stepLevel < 3"
                class="skip-link"
                @click="finishOnboarding()"
              >
                <a
                  style="text-decoration: none; color: grey;"
                  href="timeline"
                >
                  Skip
                </a>
              </div>
            </nav>

            <br>
            <br>

            <v-stepper
              v-model="stepLevel"
              vertical
            >
              <v-stepper-step
                @click="
                  moveStep(2)
                  setStepContent('installation')
                "
                editable
                data-cy="stepper"
                :complete="stepLevel > 1"
                step="1"
              >
                App Installation
                <br>
              </v-stepper-step>

              <v-stepper-content step="1">
                <div v-if="!appInstallationComplete">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      First, let's install the Ambianic UI App on your device.
                    </v-card-text>

                    <v-btn
                      style="padding: 1.2rem 1.2rem;"
                      color="primary"
                      size="2"
                      data-cy="install-app"
                      @click="installApp()"
                    >
                      <p
                        style="padding-top: 15px;"
                        v-if="!isInstallingApp"
                      >
                        Install App
                      </p>
                      <p
                        style="padding-top: 15px;"
                        v-else
                      >
                        Installing App
                      </p>

                      <v-progress-circular
                        style="padding-left: 50px;"
                        indeterminate
                        color="white"
                        v-if="isInstallingApp"
                      />
                    </v-btn>
                  </div>
                </div>
                <div v-else>
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Now you can access Ambianic as a native app on your mobile
                      or desktop device.
                    </v-card-text>

                    <v-btn
                      style="padding: 0.5rem 2rem;"
                      color="primary"
                      data-cy="continue-installation"
                      @click="
                        moveStep(2)
                        setStepContent('installation')
                      "
                    >
                      Continue

                      <v-icon right>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-stepper-content>

              <v-stepper-step
                editable
                data-cy="stepper"
                :complete="stepLevel > 2"
                step="2"
              >
                Edge Device Setup
              </v-stepper-step>

              <v-stepper-content step="2">
                <div v-if="stepContentName === 'installation'">
                  <v-card-text class="step-text">
                    Next, let's setup your Ambianic Edge Device which will
                    observe and report important events around the house.
                  </v-card-text>
                  <v-btn
                    style="padding: 0.5rem 2rem;"
                    color="primary"
                    data-cy="continue-step-2"
                    @click="setStepContent('installation-question')"
                  >
                    Continue

                    <v-icon right>
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </div>

                <div v-if="stepContentName == 'installation-question'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Are you installing Ambianic Edge Device on your local
                      network, or you will be conneciting to a device on a
                      remote network?
                    </v-card-text>
                  </div>

                  <v-container>
                    <v-row dense>
                      <v-col>
                        <v-btn
                          size="3"
                          class="align-center"
                          style="width: 100%; padding: 0.5rem 2rem;"
                          color="primary"
                          data-cy="remote-button"
                          @click="setStepContent('remote')"
                        >
                          Remote Device
                        </v-btn>
                      </v-col>

                      <v-col>
                        <div class="align-center">
                          <v-btn
                            style="width: 100%; padding: 0.5rem 2.5rem;"
                            color="primary"
                            data-cy="local-button"
                            @click="setStepContent('local')"
                          >
                            Local Device
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>

                <div v-if="stepContentName === 'remote'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      OK, you will need an invitation from the user who
                      installed the Ambianic Edge device on their local network.

                      <br>
                      <br>
                      Click the button below to request invitation granting
                      access.
                    </v-card-text>
                  </div>

                  <div class="flex">
                    <v-btn
                      color="primary"
                      data-cy="request-access"
                      @click="setStepContent('send-message')"
                    >
                      Request Access
                    </v-btn>
                  </div>
                </div>

                <div v-if="stepContentName === 'send-message'">
                  <div v-if="!hasSentAccessRequest">
                    <p class="step-text">
                      Send a message using the template below.
                    </p>

                    <div class="message-container">
                      <v-card-text class="step-text">
                        {{ invitationMessage }}
                        <br>
                      </v-card-text>
                    </div>
                    <br>
                    <div class="center">
                      <div class="flex">
                        <v-btn
                          color="primary"
                          data-cy="send-message"
                          @click="handleRequestDialog(true)"
                        >
                          Send Message
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <v-card-text
                      style="step-text"
                      align="center"
                    >
                      Messaging client to send access request initiated
                      sucessfully.
                    </v-card-text>
                    <v-card-text
                      style="step-text"
                      align="center"
                    >
                      Access Request wasn't sent successfully?

                      <span
                        color="pink darken-4"
                        class="action-text"
                        @click="handleAccessRequest(false)"
                      >
                        Resend Request
                      </span>
                    </v-card-text>

                    <br>

                    <div class="align-center">
                      <div class="flex">
                        <p style="margin: 0.5rem 0.5rem;">
                          Awaiting edge device connection
                        </p>

                        <div class="align-center">
                          <v-progress-circular
                            style="padding-left: 50px;"
                            indeterminate
                            color="primary"
                          />
                        </div>
                      </div>
                    </div>
                    <br>
                    <br>
                    <hr>
                    <br>
                    <div>
                      <div
                        class="align-center"
                        style="flex-direction: column;"
                      >
                        <v-card-text class="info-text">
                          Use recieved
                          <b>PeerID</b>
                          to pair with remote Ambianic Edge Device.
                        </v-card-text>
                        <div
                          class="flex"
                          style="justify-content: space-around;"
                        >
                          <div class="align-center">
                            <v-text-field
                              v-model="recievedPeerID"
                              type="text"
                              label="Recieved Peer ID*"
                              placeholder="Enter recieved Peer ID"
                              id="recievedPeerID"
                              outlined
                              dense
                              class="input"
                              name="peerid-input"
                            />
                          </div>

                          <div class="align-center">
                            <v-btn
                              :disabled="!isCorrectPeerId"
                              style="margin-left: 20px; margin-bottom: 20px;"
                              color="primary"
                              @click="submitPeerId()"
                              data-cy="submit-button"
                            >
                              Submit PeerID
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="stepContentName === 'local'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Are you using a pre-installed Certified Ambianic Edge
                      hardware device or you will use your own hardware?
                    </v-card-text>
                  </div>

                  <v-container>
                    <v-row dense>
                      <v-col>
                        <v-btn
                          color="primary"
                          style="width: 100%"
                          @click="setStepContent('certified')"
                        >
                          Certified
                        </v-btn>
                      </v-col>

                      <v-col>
                        <div style="padding-left: 50px;">
                          <v-btn
                            color="primary"
                            style="width: 100%"
                            @click="setStepContent('my-own')"
                          >
                            My Own
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>

                <div v-if="stepContentName === 'my-own'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Please follow the
                      <a
                        href="https://docs.ambianic.ai/users/quickstart/"
                        target="_blank"
                        rel="no-oopener"
                      >
                        Ambianic Edge DYI Install document guide
                      </a>
                      . When finished click, continue.
                    </v-card-text>
                  </div>

                  <div class="right-btn">
                    <v-btn
                      color="primary"
                      @click="setStepContent('certified')"
                    >
                      Continue

                      <v-icon right>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </div>
                </div>

                <div v-if="stepContentName === 'certified'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Let's connect to your Ambianic Edge device.
                    </v-card-text>
                  </div>

                  <div class="right-btn">
                    <v-btn
                      color="primary"
                      @click="
                        moveStep(3)
                        setStepContent('discovering')
                      "
                    >
                      Continue

                      <v-icon right>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-stepper-content>

              <v-stepper-step
                data-cy="stepper"
                step="3"
              >
                Connection Settings
              </v-stepper-step>
              <br>

              <v-stepper-content step="3">
                <div v-if="stepContentName === 'discovering'">
                  <div class="align-center">
                    <div
                      style="display: flex; flex-direction: column;"
                      v-if="peerConnectionStatus === 'PEER_CONNECTED'"
                    >
                      <div class="align-center">
                        <v-icon
                          center
                          style="color: green; font-size: 40px;"
                        >
                          mdi-check-bold
                        </v-icon>
                      </div>
                      <br>
                      <v-card-text>
                        Your local edge device has been discovered.
                        <br>
                        Click continue to proceed.
                      </v-card-text>
                    </div>

                    <div
                      v-else
                      class="flex"
                    >
                      <v-card-text>
                        Discovering your local edge device...
                      </v-card-text>

                      <div class="align-center">
                        <v-progress-circular
                          style="padding-left: 50px;"
                          indeterminate
                          color="blue"
                          v-if="peerConnectionStatus !== 'PEER_CONNECTED'"
                        />
                      </div>
                    </div>
                  </div>
                  <br>
                  <div class="right-btn">
                    <v-btn
                      :disabled="peerConnectionStatus !== 'PEER_CONNECTED'"
                      style="padding: 0.5rem 2rem;"
                      color="primary"
                      @click="setStepContent('settings')"
                    >
                      Continue

                      <v-icon right>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </div>
                </div>

                <div v-if="stepContentName === 'connection'">
                  <div class="flex-between">
                    <v-card-text class="step-text">
                      Connecting to edge...
                    </v-card-text>
                  </div>

                  <div class="flex">
                    <v-btn
                      style="padding: 0.5rem 2rem;"
                      color="primary"
                      @click="
                        moveStep(3)
                        setStepContent('settings')
                      "
                    >
                      Continue
                    </v-btn>
                  </div>
                </div>

                <div v-if="stepContentName === 'settings'">
                  <div>
                    <v-card-text class="step-text">
                      Edge Device Connected!
                    </v-card-text>
                    <v-card-text>Edge Peer ID: {{ edgePeerId }}.</v-card-text>
                  </div>
                  <br>
                  <div class="align-center">
                    <v-btn
                      style="padding: 0.5rem 2rem;"
                      color="primary"
                      to="timeline"
                      @click="finishOnboarding()"
                    >
                      Complete Installation
                    </v-btn>
                  </div>
                </div>
              </v-stepper-content>
            </v-stepper>
          </v-list-item-content>
        </v-list-item>
        <br>
        <br>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { PEER_CONNECTED } from '@/store/mutation-types'
import { CHANGE_REMOTE_PEER_ID } from '@/store/action-types'

const MESSAGE_CLIENTS = [
  {
    name: 'Email',
    content: `mailto:bob@gmail.com?subject=Ambianic Edge Access Request&body=Bob please send me an access invitation to your Ambianic Edge device.
https://ui.ambianic.ai/share`,
    icon: 'email'
  },
  {
    name: 'SMS Message',
    content: 'sms:&body=Testing%Ambianic%UI',
    icon: 'message-processing'
  },
  {
    name: 'Whatsapp',
    content: 'whatsapp://send?text=Testing%Ambianic%sharing',
    icon: 'whatsapp'
  },
  {
    name: 'iMessage',
    content: '#',
    icon: 'apple'
  }
]

export default {
  name: 'Onboarding',
  data () {
    return {
      installPrompt: null,
      stepLevel: localStorage.getItem('lastOnboardingStage') || 1,
      stepContentName: localStorage.getItem('lastOnboardingStep') || '',
      isInstallingApp: false,
      invitationMessage: 'Hi ____, please send me an access invitation to your Ambianic Edge Device.',
      appInstallationComplete: false,
      completedSteps: [],
      sendRequestDialog: false,
      hasSentAccessRequest: false,
      MESSAGE_CLIENTS,
      recievedPeerID: undefined,
      isCorrectPeerId: false
    }
  },
  computed: {
    ...mapState({
      peerConnectionStatus: (state) => state.pnp.peerConnectionStatus,
      isEdgeConnected: (state) =>
        state.pnp.peerConnectionStatus === PEER_CONNECTED,
      edgePeerId: (state) => state.pnp.remotePeerId,
      version: (state) => state.version
    })
  },
  created () {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()

      this.installPrompt = e
    })
  },
  methods: {
    ...mapActions(['CHANGE_REMOTE_PEER_ID']),

    validatePeerId (value) {
      if (
        /^([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})$/.test(
          value
        )
      ) {
        this.isCorrectPeerId = true
        return this.isCorrectPeerId
      } else {
        this.isCorrectPeerId = false
        return this.isCorrectPeerId
      }
    },

    installApp () {
      this.isInstallingApp = true

      // catch error incase installPrompt is undefined as previous app installtion has been done
      try {
        this.installPrompt.prompt()
      } catch (e) {
        console.log(e, 'error installing app')
      }

      setTimeout(() => {
        this.appInstallationComplete = true
      }, 1000)
    },

    moveStep (stage) {
      this.stepLevel = stage

      localStorage.setItem('lastOnboardingStage', stage)
    },

    setStepContent (name) {
      this.stepContentName = name

      localStorage.setItem('lastOnboardingStep', name)
    },

    handleRequestDialog (state) {
      if (navigator.share) {
        navigator.share({
          title: 'Ambianic Edge Device Access Request',
          text: this.invitationMessage
        })
      } else {
        this.sendRequestDialog = state
      }
    },

    finishOnboarding () {
      window.localStorage.setItem('hasCompletedOnboarding', true)
    },

    handleAccessRequest (state) {
      this.sendRequestDialog = false
      this.hasSentAccessRequest = state
    },

    submitPeerId () {
      this.$store.dispatch(CHANGE_REMOTE_PEER_ID, this.recievedPeerID)
    }
  },
  watch: {
    isEdgeConnected: function (newVal, oldVal) {
      if (newVal) {
        this.stepLevel = 3
        this.stepContentName = 'settings'
      }
    },
    recievedPeerID: function (value) {
      this.validatePeerId(value)
    }
  }
}
</script>

<style lang="css" scoped>
.input-field {
  color: #000;
  border: 1px solid #c0c0c0;
  border-radius: 3px;
  height: 40px;
  width: 23rem;
  padding: 0.4rem 1rem;
}

.action-text {
  color: red;
  margin: 0 0.5rem;
}

.action-text:hover {
  cursor: pointer;
}

.btn {
  width: auto;
  padding: 0.5rem 3rem;
}

.list {
  list-style: none;
  padding-left: 30px;
}

.info-text {
  font-size: 0.95rem;
  color: rgb(84, 84, 84);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0.7rem 1rem;
  transition: all 300ms;
  margin-right: 20px;
}

.list-item:hover {
  cursor: pointer;
  background: rgba(233, 241, 251, 0.81);
}

.title {
  font-weight: semi-bold;
}

.hover-text {
  color: grey;
}

.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  padding: 0.5rem 1rem;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  background-color: rgba(233, 241, 251, 0.81);
}

.flex {
  display: flex;
  flex-direction: row;
}

.space-btns {
  display: flex;
  justify-content: space-evenly;
}

.step-text {
  opacity: 0.95;
  text-align: left;
  padding-top: 5px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
}

.right-btn {
  text-align: right;
}

.button-flex {
  display: flex;
}

.see-thru {
  opacity: 0.8;
}

.container {
  width: 100%;
}

.align-center {
  display: flex;
  justify-content: center;
}

.body {
  background-color: rgba(233, 241, 251, 0.81);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 78px);
}

.input {
  width: 400px;
}

@media (max-width: 800px) {
  .flex-between {
    flex-direction: column;
  }

  .input {
    width: 350px;
  }

  .flex {
    flex-direction: column;
  }
}
</style>
