<template>
  <MDBContainer>
    <email-success
      :message = emailSuccessMessage
    />
    <email-error
        :message = emailErrorMessage
    />
    <form class="forgot" @submit.prevent="handleSubmitForgot">

      <MDBInput
          type="email"
          id="giveEmail"
          white
          size="lg"
          label="Anna oma sähköpostisi"
          v-model="emailConfirmation"
          wrapperClass="mb-4"
      />
      <MDBBtn type="submit" block color="success">Lähetä</MDBBtn>
    </form>
  </MDBContainer>
</template>

<script>
import authService from '../service/pwAuth'
import emailSuccess from '../components/notifications/successMessage'
import emailError from '../components/notifications/errorMessage'
import {
  MDBContainer,
    MDBInput,
    MDBBtn
} from 'mdb-vue-ui-kit'
import '@/css/style.css';
import '@/css/notification.css'
export default {
  name: "Forgot",
  components: {
    emailSuccess,
    emailError,
    MDBContainer,
    MDBInput,
    MDBBtn
  },
  data () {
    return {
      emailConfirmation: "",
      emailSuccessMessage: null,
      emailErrorMessage: null,
      giveEmail: ""
    }
  },
  methods: {
    async handleSubmitForgot () {
      if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.emailConfirmation)) {
        this.emailErrorMessage = "Anna kelvollinen sähköpostiosoite!"
        setTimeout(() => {
          this.emailErrorMessage = null;
        }, 2000);
      } else {
        const data = {
          email: this.emailConfirmation
        }
        console.log("email for reset " + data.email)
        // -----
        const resetPw = await authService.forgot({email: this.emailConfirmation});
        this.emailSuccessMessage = resetPw.result;
        setTimeout(() => {
          this.emailSuccessMessage = null;
        }, 3000);
        console.log("Reset password result: " + resetPw.result);
      }


      // const response = await axios.post('Forgot', {
      //   email: this.email
      // })
      // console.log("Responce " + response);
    }
  }
}
</script>

<style scoped>

</style>