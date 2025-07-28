<template>
  <MDBContainer style="padding-top: 70px; padding-bottom: 20px; text-align: center;">
    <h3 style="text-align: right; color: forestgreen; padding-bottom: 50px;" @click="$router.go(-1)">Poistu</h3>
    <payment
      v-if="isPaymentSelected"
      :payment = payment
      :creditLeft = creditLeft
      @pay = handlePayment
      @quit-payment = handleQuitPayment
    />
    <MDBRow v-else>
      <MDBCol lg="3" md="6" class="plan-panel">
        <MDBCard class="plan">
          <MDBCardHeader>Päivä</MDBCardHeader>
          <MDBCardBody>
            <MDBCardTitle>1 päivää</MDBCardTitle>
            <MDBCardText>

            </MDBCardText>
            <MDBBtn outline="info" size="lg" @click="selectPayment(1, 1)">7 Euroa</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="3" md="6" class="plan-panel">
        <MDBCard class="plan">
          <MDBCardHeader>Viikko</MDBCardHeader>
          <MDBCardBody>
            <MDBCardTitle>7 päivää</MDBCardTitle>
            <MDBCardText>

            </MDBCardText>
            <MDBBtn outline="info" size="lg" @click="selectPayment(14, 7)">14 Euroa</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="3" md="6" class="plan-panel">
        <MDBCard class="plan">
          <MDBCardHeader>Kuukausi</MDBCardHeader>
          <MDBCardBody>
            <MDBCardTitle>1 kuukausi</MDBCardTitle>
            <MDBCardText>

            </MDBCardText>
            <!--            <MDBBtn tag="a" href="#!" color="primary">Go somewhere</MDBBtn>-->
            <MDBBtn outline="info" size="lg"  @click="selectPayment(30, 30)">30 Euroa</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="3" md="6" class="plan-panel">
        <MDBCard class="plan">
          <MDBCardHeader>6 kuukautta</MDBCardHeader>
          <MDBCardBody>
            <MDBCardTitle>6 kk</MDBCardTitle>
            <MDBCardText>

            </MDBCardText>
            <!--            <MDBBtn tag="a" href="#!" color="primary">Go somewhere</MDBBtn>-->
            <MDBBtn outline="info" size="lg" @click="selectPayment(100, 183)">100 Euroa</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol lg="3" md="6">
        <MDBCard class="plan">
          <MDBCardHeader>Vuosi</MDBCardHeader>
          <MDBCardBody>
            <MDBCardTitle>12 kk</MDBCardTitle>
            <MDBCardText>

            </MDBCardText>
            <!--            <MDBBtn tag="a" href="#!" color="primary">Go somewhere</MDBBtn>-->
            <MDBBtn outline="info" size="lg" @click="selectPayment(120, 366)">120 Euroa</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>


  </MDBContainer>



</template>

<script>
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
    MDBCardHeader,
    MDBCardBody,
  MDBCardTitle,
    MDBCardText,
    MDBBtn

} from 'mdb-vue-ui-kit'
import Payment from '../pages/Payment';
import proService from '../service/providers';
export default {
  name: "PayPlan",
  props: {
    userIsProvider: Object,
    creditLeft: null
  },
  components: {
    Payment,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn
  },
  data () {
    return {
      payment: 0,
      paid: null,
      time: null,
      isPaymentSelected: false
    }
  },
  methods: {
    selectPayment (value, days) {
      this.payment = value;
      this.time = days;
      this.isPaymentSelected = true;
    },
    handlePayment (amount) {
      // 1711660130626
      console.log("Olet maksanut " + amount + " euroa")
      // Add renewed time to database (creditLeft = days left)
      console.log("This creditLeft type " + typeof this.creditLeft)
      console.log("This time type " + typeof this.time)

      const daysAccountToAdd = parseInt(this.time);
      const daysLeftAccount = parseInt(this.creditLeft);

      const daysAfterUpdate = daysAccountToAdd + daysLeftAccount;
      console.log("Days after update: " + daysAfterUpdate);
      const timeCredit = new Date().getTime() + ((daysAccountToAdd + daysLeftAccount) * 86400000) ;
      if (timeCredit) {
        this.$emit("updateProTimeCredit", daysAfterUpdate)
        proService.updateTimeCredit(this.userIsProvider.id, {proTime: timeCredit})
        this.paid = "Olet maksanut " + amount + " euroa!"
        setTimeout(() => {
          this.timeEditErrorMessage = null
        }, 2000)
      }

    },
    handleQuitPayment () {
      this.isPaymentSelected = false;
    }
  }
}
</script>

<style scoped>
.plan-panel {
  padding-bottom: 50px;
}
.plan {
  background-color: #3d4042;
  color: #ddd;

}
</style>