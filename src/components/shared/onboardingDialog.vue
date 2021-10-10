<template>
  <v-dialog
    id="dialog-component"
    :max-width="maxWidth"
    v-model="invitationDialog"
    persistent
    data-cy="messaging-option-modal"
  >
    <v-card id="dialog-card">
      <v-card-title
        id="dialog-title"
        class="headline"
      >
        {{ modalTitle }}
      </v-card-title>
      <br>
      <v-card-text id="dialog-text">
        {{ modalText }}
      </v-card-text>

      <v-divider />

      <ul>
        <li
          v-for="client in ONBOARDING_MESSAGE_CLIENTS"
          :key="client.name"
          :class="client.name"
        >
          <div
            class="messaging-client"
            @click="$store.commit('ONBOARDING_INVITATION_REQUEST', { shouldSendAccessRequest: true })"
          >
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
          data-cy="dialog-close-btn"
          @click="$store.commit('ONBOARDING_INVITATION_REQUEST', { dialogState : false })"
        >
          {{ rightBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { ONBOARDING_MESSAGE_CLIENTS } from '@/components/utils'

export default {
  name: 'OnboardingDialog',
  data: () => ({
    ONBOARDING_MESSAGE_CLIENTS
  }),
  computed: {
    ...mapState({
      invitationDialog: state => state.onboardingWizard.invitationDialog
    })
  },
  props: {
    maxWidth: {
      type: String,
      default: '500'
    },
    modalTitle: {
      type: String,
      required: true
    },
    modalText: {
      type: String,
      required: true
    },
    rightBtnText: {
      type: String,
      default: 'Cancel'
    }
  }
}
</script>
