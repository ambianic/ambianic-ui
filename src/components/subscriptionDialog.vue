<template>
  <v-dialog
    v-model="showDialog"
    max-width="550"
  >
    <v-card style="display: flex; flex-direction: column; overflow: hidden">
      <v-card-title class="headline">
        Premium Subscription Model
      </v-card-title>
      <v-card-text>Subscribe to Ambianic's Edge Premium Subscription Model for more extra added values</v-card-text>
      <div>
        <h3 style="font-weight: 500; text-align: center">
          $5 Monthly Fee
        </h3>
        <br>
      </div>
      <v-spacer />
      <v-list-item v-if="showInputs">
        <v-col>
          <v-text-field
            v-model="fullName"
            type="text"
            label="CardHolder Name"
            placeholder="CardHolder Name"
            id="cardHolderName"
            outlined
            dense
            class="input"
            name="cardHolderName"
          />

          <v-text-field
            v-model="cardNumber"
            type="text"
            label="Card Number"
            placeholder="Enter Number on Card"
            id="cardNumber"
            outlined
            dense
            class="input"
            name="cardNumber"
          />

          <v-text-field
            v-model="emailAddress"
            type="text"
            label="Billing Email Address"
            :placeholder="this.email"
            id="emailAddress"
            outlined
            dense
            class="input"
            name="emailAddress"
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
                outlined
                dense
                class="input"
                name="cvc"
              />
            </v-col>

            <v-col>
              <v-text-field
                v-model="expiryMonth"
                type="number"
                maxlength="2"
                label="Expiry Month"
                placeholder="MM"
                id="expiryMonth"
                outlined
                dense
                class="input"
                name="expiryMonth"
              />
            </v-col>

            <v-col>
              <v-text-field
                v-model="expiryYear"
                type="number"
                label="Expiry Year"
                placeholder="YY"
                id="expiryYear"
                maxlength="2"
                outlined
                dense
                class="input"
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
          @click="showDialog = false"
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
        style="display: flex; justify-content: space-between"
        v-else
      >
        <v-btn
          color="grey"
          data-cy="dismiss-modal"
          text
          @click="showDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          data-cy="confirm-btn"
          :disabled="!cardNumberIsValid"
          @click="submitSubscription()"
          style="display: flex"
        >
          {{ loading ? "Confirming Details" : "Confirm Details" }}
          <v-progress-circular
            style="padding-left: 40px;"
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

const cardValidator = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/

export default {
  name: 'SubcriptionDialog',
  data: () => ({
    showDialog: true,
    showInputs: false,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    fullName: '',
    cardNumberIsValid: false,
    emailAddress: '',
    loading: false
  }),
  created () {
    this.emailAddress = this.email
  },
  props: {
    email: {
      type: String,
      default: ''
    },
    completeSubscription: {
      type: Function,
      default: () => {
      }
    }
  },
  methods: {
    submitSubscription () {
      this.loading = true

      const cardDetails = JSON.stringify({
        number: this.cardNumber,
        cvc: this.cvc,
        cardName: this.fullName,
        exp_year: this.expiryYear,
        exp_month: this.expiryMonth
      })

      // TODO: Figure out how to pass data into function using req body
      fetch(`${process.env.VUE_APP_FUNCTIONS_ENDPOINT}/subscriptions?email=${this.emailAddress}&card=${cardDetails}`, {
        method: 'POST',
        body: JSON.stringify(cardDetails),
        headers: {
          headers: {
            accept: 'Accept: application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          }
        }
      }).then(() => {
        this.loading = false
        this.showDialog = false
        this.completeSubscription()
      }).catch(error => {
        console.log(error)
        this.showDialog = false
      })
    },
    validateCardNumber (number) {
      if (cardValidator.test(number)) {
        this.cardNumberIsValid = true
      }
    }
  },
  watch: {
    cardNumber: function (numbers) {
      this.validateCardNumber(numbers)
    }
  }
}
</script>

<style scoped>

</style>
