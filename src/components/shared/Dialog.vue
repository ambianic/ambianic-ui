<template>
  <!-- eslint-disable-next-line -->
  <v-dialog
      id="dialog-component"
    :max-width="maxWidth"
    v-model="showModal"
    persistent
  >
    <v-card id="dialog-card" >
      <v-card-title id="dialog-title" class="text-h6 grey">
        {{ modalTitle }}
      </v-card-title>
      <br>
      <v-card-text id="dialog-text" >
        {{ modalText }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="leftBtnFunc()"
        >
          Confirm
        </v-btn>

        <v-btn
          color="primary"
          text
          @click="rightBtnFunc()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  data: () => ({
    showModal: false
  }),
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
    visibility: {
      type: Boolean,
      default: false
    },
    leftBtnFunc: {
      type: function () {},
      default: () => {}
    },
    rightBtnFunc: {
      type: function () {},
      default: () => {}
    }
  },
  watch: {
    visibility: function (val) {
      this.showModal = val
    }
  }
}
</script>
