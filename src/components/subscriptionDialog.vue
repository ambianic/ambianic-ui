<template>
  <v-dialog
    id="subscription-dialog"
    v-model="showSubscriptionDialog"
    max-width="550"
  >
    <v-card style="display: flex; flex-direction: column; overflow: hidden;">
      <div id="subscription-details">
        <v-card-title class="headline">
          Premium Subscription
        </v-card-title>
        <v-card-text data-cy="detail">
          Subscribe to Ambianic Premium Services to enable advanced
          features, such as instant email notification.
        </v-card-text>
        <div>
          <h3
            data-cy="price"
            style="font-weight: 500; text-align: center;"
          >
            $5 Monthly Fee
          </h3>
          <br>
        </div>
      </div>

      <div
        id="error"
        v-if="subscriptionError"
      >
        <p class="error-text">
          An error occurred while adding your subscription. Sorry for the inconvenience. We are working hard to resolve the issue. Please try again a little later.
        </p>
      </div>

      <v-spacer />
      <v-list-item
        class="inputs-ctn"
        v-if="showInputs"
      >
        <v-col>
          <v-text-field
            v-model="fullName"
            type="text"
            label="CardHolder Name"
            placeholder="CardHolder Name"
            id="cardHolderName"
            outlined
            dense
            data-cy="cardHolderName"
          />

          <v-text-field
            v-model="cardNumber"
            type="number"
            label="Card Number"
            :rules="[rules.required]"
            placeholder="Enter Number on Card"
            id="cardNumber"
            outlined
            dense
            data-cy="cardNumber"
          />

          <v-text-field
            v-model="emailAddress"
            type="email"
            label="Billing Email Address"
            :placeholder="this.user.email"
            id="emailAddress"
            outlined
            dense
            data-cy="emailAddress"
          />

          <v-row>
            <v-col>
              <v-text-field
                v-model="cvc"
                type="number"
                label="CVC Number"
                maxlength="3"
                placeholder="CVC"
                id="cvc"
                :rules="[rules.required]"
                outlined
                dense
                name="cvc"
              />
            </v-col>

            <v-col>
              <v-text-field
                v-model="expiryMonth"
                type="number"
                maxlength="2"
                label="Expiry Month"
                :rules="[rules.required]"
                placeholder="MM"
                id="expiryMonth"
                outlined
                dense
                name="expiryMonth"
              />
            </v-col>

            <v-col>
              <v-text-field
                v-model="expiryYear"
                type="number"
                :rules="[rules.required]"
                label="Expiry Year"
                placeholder="YY"
                id="expiryYear"
                maxlength="2"
                outlined
                dense
                name="expiryYear"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-list-item>

      <v-card-actions v-if="!showInputs">
        <v-btn
          color="grey"
          text
          @click="handleSubscriptionDialog(false)"
          data-cy="dismiss-modal"
        >
          Subscribe Later
        </v-btn>
        <v-btn
          color="primary"
          text
          data-cy="subscribe"
          @click="showInputs = true"
        >
          Subscribe Now
        </v-btn>
      </v-card-actions>

      <v-card-actions
        style="display: flex; justify-content: space-between;"
        v-else
      >
        <v-btn
          color="grey"
          data-cy="dismiss-modal"
          text
          @click="handleSubscriptionDialog(false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          id="confirm-btn"
          data-cy="confirm-btn"
          :disabled="!cardNumberIsValid"
          @click="submitSubscription()"
          style="display: flex;"
        >
          {{ loading ? 'Confirming Details' : 'Confirm Details' }}
          <v-progress-circular
            style="padding-left: 40px;"
            id="subscription-spinner"
            indeterminate
            v-if="loading"
            :width="2.5"
            :size="20"
            color="primary"
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  HANDLE_SUBSCRIPTION_DIALOG, HANDLE_EDGE_SYNC_DIALOG, FETCH_USER_SUBSCRIPTION
} from '@/store/action-types'
import { mapActions, mapState } from 'vuex'
const cardValidator = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/

export default {
  name: 'SubscriptionDialog',
  data: () => ({
    showInputs: false,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    fullName: '',
    subscriptionError: null,

    cardNumberIsValid: false,
    emailAddress: '',
    loading: false,
    rules: {
      required: value => !!value || 'Required.'
    }
  }),
  methods: {
    ...mapActions([HANDLE_SUBSCRIPTION_DIALOG, FETCH_USER_SUBSCRIPTION, HANDLE_EDGE_SYNC_DIALOG]),
    async handleSubscriptionDialog (state) {
      await this.$store.dispatch('HANDLE_SUBSCRIPTION_DIALOG', state)
    },
    async submitSubscription () {
      this.loading = true

      try {
        const req = await fetch(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription`, {
          method: 'POST',
          body: JSON.stringify({
            email: this.user.email,
            number: this.cardNumber,
            cvc: this.cvc,
            exp_year: this.expiryYear,
            exp_month: this.expiryMonth
          }),
          headers: {
            'content-type': 'application/json'
          }
        })

        if (req.status === 200) {
          const { userStripeId, userSubscriptionId } = await req.json()
          await this.saveStripeData(userStripeId, userSubscriptionId)
        } else {
          this.subscriptionError = req
          console.log('ERROR CREATING SUBSCRIPTION', req)
        }
      } catch (e) {
        this.subscriptionError = e
        console.log(e, 'ERROR FROM STRIPE')
      } finally {
        this.loading = false
      }
    },
    async saveStripeData (userStripeId, userSubscriptionId) {
      await fetch(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscription-data`,
        {
          method: 'POST',
          body: JSON.stringify({
            userStripeId,
            userSubscriptionId,
            user_id: this.user.sub
          }),
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      this.loading = false
      await this.$store.dispatch(HANDLE_SUBSCRIPTION_DIALOG, false)
      await this.$store.dispatch(FETCH_USER_SUBSCRIPTION, this.user.sub)
      await this.$store.dispatch(HANDLE_EDGE_SYNC_DIALOG, true)
    }
  },
  computed: {
    ...mapState({
      showSubscriptionDialog: state => state.premiumService.showSubscriptionDialog,
      user: state => state.premiumService.user
    })
  },
  watch: {
    cardNumber: function (numbers) {
      this.cardNumberIsValid = cardValidator.test(numbers)
    }
  }
}
</script>

<style scoped>
.error-text {
  color: #ff0033;
  text-align: center;
}
</style>
