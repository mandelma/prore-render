<template>
  <div>
    <loginError
        :message = loginErrorMessage
    />
    <form class="login" @submit.prevent="userLoginData" autocomplete="off">
      <MDBInput
          type="text"
          size="lg"
          label="Käyttäjätunnus"
          white
          id="loginUsername"
          v-model="loginUsername"
          wrapperClass="mb-4"
      />

      <!-- Password input -->
      <MDBInput

          type="password"
          size="lg"
          label="Salasana"
          white
          id="loginPassword"
          v-model="loginPassword"
          wrapperClass="mb-4"
      />

      <!-- 2 column grid layout for inline styling -->
      <MDBRow class="mb-4">
        <MDBCol class="d-flex justify-content-center">
          <!-- Checkbox -->
          <MDBCheckbox
              label="Muista minut"
              white
              id="loginCheck"
              v-model="loginCheck"
              wrapperClass="mb-3 mb-md-0"
          />
        </MDBCol>

        <MDBCol>
          <!-- Simple link -->
          <router-link to="/forgot_auth">Forgot password</router-link>
<!--          <a href="/recipients">Unohtuiko salasana?</a>-->
        </MDBCol>
      </MDBRow>

      <!-- Submit button -->
      <MDBBtn white color="primary" size="lg" type="submit" block class="mb-4"> Kirjaudu </MDBBtn>

      <!-- Register buttons -->
      <div class="text-center">
        <p>Ei jäsen? <span id="reg" @click="this.$router.push('/register')" style="cursor: pointer;">rekisteröidy</span></p>
      </div>
    </form>
  </div>
</template>

<script>
/* eslint-disable */
// @click="userLoginData"
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon
} from "mdb-vue-ui-kit";
import { ref } from "vue";
import loginService from "@/service/login";
import loginError from '../components/notifications/errorMessage'
import '@/css/style.css';
import '@/css/notification.css'
export default {
  name: "login-form",
  components: {
    loginError,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBRow,
    MDBCol,
    MDBIcon
  },
  setup() {

    const loginUsername = ref("");
    const loginPassword = ref("");
    const loginCheck = ref(true);
    const loginErrorMessage = ref(null);

    return {

      loginUsername,
      loginPassword,
      loginCheck,
      loginErrorMessage
    };
  },
  methods: {
    // Data from login fields forward
    async userLoginData () {
      let user;
      const userLogin = {
        username: this.loginUsername,
        password: this.loginPassword
      }


      if (this.loginUsername !== "" && this.loginPassword !== "") {
        user = await loginService.login(userLogin)
        if (user.error !== "login error") {
          console.log("User logged in")
          this.$emit('login:data', user)
        } else {
          console.log("No user logged in")
          this.loginError = "Väärä Käyttäjätunnus tai salasana!"
          this.loginErrorMessage = "Väärä Käyttäjätunnus tai salasana!";
          setTimeout(() => {
            this.loginErrorMessage = null;
          }, 2000);
        }
      } else {
        this.loginErrorMessage = "kaikki kentät on täytettävä!"
        setTimeout(() => {
          this.loginErrorMessage = null
        }, 2000);
      }

      //this.$emit('login:data', userLogin)
      this.emptyLoginFields()
    },
    // empty login form fields after login
    emptyLoginFields () {
      this.loginUsername = ""
      this.loginPassword = ""
      this.loginCheck = false
    }
  }
}
</script>

<style >
#reg {
  padding: 10px;
  color: deepskyblue;
}
/*.mdb.input {*/
/*  background-color: grey;*/
/*}*/

/*.mdb.input-control {*/
/*  color: red;*/
/*}*/




/*input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px green inset !important; } input:-webkit-autofill:focus { -webkit-box-shadow: 0 0 0 1000px blue inset !important; }*/

/*.mdb.input-control:focus {*/
/*  color: red;*/
/*}*/
</style>