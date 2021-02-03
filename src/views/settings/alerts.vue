<template>
  <div>
    <p style="color: rgb(84, 84, 84);">
      Some quick description about the email feature to users Some quick description about the email feature to users Some quick description about the email feature to users Some quick description
    </p>
    <div class="align-center">
      <v-text-field
        v-model="emailAddress"
        type="text"
        label="Email Address"
        placeholder="Email Address"
        id="emailField"
        outlined
        dense
        class="input"
        name="email-field"
      />

      <button class="button">
        Save Email Address
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data () {
    return {
      emailAddress: ''
    }
  }
}
</script>

<style lang="css" scoped>
  .button {
    display: flex;
    flex : 1;
    width: 100%;
    text-align: center;
    height: 40px;
    font-size: .85rem;
    justify-content: center;
    padding: .5rem 2rem;
    background-color: #3566b1;
    border: 1px solid #3566b1;
    border-radius: 5px;
    color: #fff;
  }
</style>
