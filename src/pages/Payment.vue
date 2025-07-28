<template>
  <MDBContainer>


    <h2>Maksaa {{payment}} euroa</h2>
    <MDBBtn color="dark" style="width: 200px;" size="lg" @click="payCredit">
      <img
          style="width: 50px;"
          :src="require(`@/assets/mastercard.png`)"
          alt="payment"
      />

    </MDBBtn>

<!--    Payment credit left  {{creditLeft}}-->

  </MDBContainer>
</template>

<script>
import {
  MDBContainer,
    MDBBtn
} from 'mdb-vue-ui-kit'
export default {
  name: "Payment",
  props: {
    payment: Number,
    creditLeft: null
  },
  components: {
    MDBContainer,
    MDBBtn
  },
  methods: {
    payCredit () {
      this.$emit("pay", this.payment);
      this.$router.go(-1);
    },
    quitPayment () {
      this.$emit("quit-payment")
    }
  }
}
</script>

<style scoped>

</style>