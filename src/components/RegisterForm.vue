<template>
  <div>
<!--    <h2 style="margin-top: 50px; text-align: center">- Rekisteröintilomake -</h2>-->
    <MDBContainer style="margin-top: 50px;">

      <registerError
          :message = registerErrorMessage
      />
      <registerError
          :message = usernameExisting
      />
      <registerError
          :message = registerEmailErrorMessage
      />
      <register-error
        :message = registerPwRepeatErrorMessage
      />
      <form class="register" @submit.prevent="userData" autocomplete="off">
        <!-- 2 column grid layout with text inputs for the first and last names -->
        <!-- First name input -->

        <MDBInput
            type="text"
            size="lg"
            label="Etunimi"
            white
            id="registerFirstName"
            v-model="registerFirstName"
            wrapperClass="mb-4"
        />

        <!-- Last name input -->
        <MDBInput
            type="text"
            size="lg"
            label="Sukunimi"
            white
            id="registerLastName"
            v-model="registerLastName"
            wrapperClass="mb-4"
        />

        <!-- Username input -->
        <MDBInput
            type="text"
            size="lg"
            label="käyttäjätunnus"
            white
            id="registerUsername"
            v-model="registerUsername"
            wrapperClass="mb-4"
        />
        <!-- Email input -->
        <MDBInput
            type="text"
            size="lg"
            label="Email"
            white
            id="registerEmail"
            v-model="registerEmail"
            wrapperClass="mb-4"
        />
<!--        <div>-->
<!--          Email is {{isValidEmail ? 'valid' : 'invalid'}}-->
<!--        </div>-->
        <!-- Password input -->

        <MDBInput
            white
            inputGroup
            :type="showPassword ? 'text' : 'password'"
            :formOutline="true"
            wrapperClass="mb-3"
            v-model="registerPassword"
            label="Anna salasana"
            aria-describedby="button-addon2"
        >

          <MDBBtn  id="button-addon2" :ripple="{ color: 'dark' }">

            <i :class="!showPassword ? 'far fa-eye' : 'far fa-eye-slash'" style="color: #dddddd;" @click="togglePassword"></i>
          </MDBBtn>
        </MDBInput>


        <p v-if="pwValidateError && registerPassword" style="color: palevioletred" >{{pwValidateError}}</p>


        <MDBInput
            white
            inputGroup
            :type="showConfirmPassword ? 'text' : 'password'"
            :formOutline="true"
            wrapperClass="mb-3"
            v-model="registerPasswordRepeat"
            label="Toista salasana"
            aria-describedby="button-addon2"
        >

          <MDBBtn  id="icon-addon2" :ripple="{ color: 'dark' }">

            <i :class="!showConfirmPassword ? 'far fa-eye' : 'far fa-eye-slash'" style="color: #dddddd;" @click="toggleConfirmPassword"></i>
          </MDBBtn>
        </MDBInput>

        <p v-if="pwConfirmValidateError && registerPasswordRepeat" style="color: palevioletred" >{{pwConfirmValidateError}}</p>

        <!-- Repeat Password input -->

<!--        <MDBInput-->
<!--            type="password"-->
<!--            size="lg"-->
<!--            label="Toista salasana"-->
<!--            white-->
<!--            id="registerPasswordRepeat"-->
<!--            v-model="registerPasswordRepeat"-->
<!--            wrapperClass="mb-4"-->
<!--        />-->

        <!-- Checkbox -->
        <MDBCheckbox
            label="Muista minut"
            white
            size="lg"
            id="registerSubscribeCheck"
            v-model="registerSubscribeCheck"
            wrapperClass="d-flex justify-content-center mb-4"
        />

<!--        <input required="required" v-model="registerEmail" :error-messages="emailErrors"-->
<!--               @input="$v.registerEmail.$touch()" @blur="$v.registerEmail.$touch()" label="Email"-->
<!--               />-->

        <!-- Submit button -->
        <MDBBtn outline="primary" size="lg" type="submit"  block class="mb-4" :disabled="!!pwValidateError"> Luo tili </MDBBtn>

      </form>
    </MDBContainer>

  </div>

</template>

<script >
/* eslint-disable */
// import { validationMixin } from 'vuelidate'
// import { required, email} from 'vuelidate/lib/validators'
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from "mdb-vue-ui-kit";
import { ref, watch } from "vue";
import userService from "@/service/users";
import googleService from '@/service/googleAuth'
import loginService from "@/service/login";
import registerError from '../components/notifications/errorMessage'
import '@/css/style.css';
import '@/css/notification.css'


export default {
  name: "app-register",
  components: {
    registerError,
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  },
  // mixins: [validationMixin],
  // validations: {
  //
  //   email: { required, email },
  //
  // },
  data () {
    return {
      registerErrorMessage: null,
      registerEmailErrorMessage: null,
      registerPwRepeatErrorMessage: null,
      usernameExisting: null,
    }
  },

  //  'YOUR_APP_CLIENT_ID.apps.googleusercontent.com'

  setup() {
    const registerFirstName = ref("");
    const registerLastName = ref("");
    const registerUsername = ref("");
    const registerEmail = ref("");
    const registerPassword = ref("");
    const registerPasswordRepeat = ref("");
    const registerSubscribeCheck = ref(true);
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const pwValidateError = ref("")
    const pwConfirmValidateError = ref("")
    const togglePassword = () => {
      console.log("Password is toggled")
      showPassword.value = !showPassword.value
    }
    const toggleConfirmPassword = () => {
      console.log("Password confirm is toggled!");
      showConfirmPassword.value = !showConfirmPassword.value;
    }
    const validatePassword = () => {
      const regex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!regex.test(registerPassword.value)) {
        pwValidateError.value = "Salasanan on oltava vähintään 8 merkkiä pitkä ja sen on sisällettävä iso kirjain, numero ja erikoismerkki.";
      } else {
        pwValidateError.value = "";
      }
    }

    const validateConfirmPassword = () => {
      const regex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!regex.test(registerPasswordRepeat.value)) {
        pwConfirmValidateError.value = "Salasanan on oltava vähintään 8 merkkiä pitkä ja sen on sisällettävä iso kirjain, numero ja erikoismerkki.";
      } else {
        pwConfirmValidateError.value = "";
      }
    }

    watch(registerPassword, (newValue) => {
      validatePassword(newValue);
    })

    watch(registerPasswordRepeat, (newValue) => {
      validateConfirmPassword(newValue);
    })

    return {
      registerLastName,
      registerFirstName,
      registerUsername,
      registerEmail,
      registerPassword,
      registerPasswordRepeat,
      registerSubscribeCheck,
      pwValidateError,
      pwConfirmValidateError,
      showPassword,
      showConfirmPassword,
      togglePassword,
      toggleConfirmPassword,
      validatePassword
    };
  },
  computed: {
    isValidEmail() {
      return /^[^@]+@\w+(\.\w+)+\w$/.test(this.registerEmail);
    }
  },
  // computed: {
  //   emailErrors () {
  //     const errors = []
  //     if (!this.$v.email.$dirty) return errors
  //     !this.$v.email.email && errors.push('Must be valid e-mail')
  //     !this.$v.email.required && errors.push('E-mail is required')
  //     return errors
  //   },
  // },
  methods: {
    // validatePassword () {
    //
    // },
    emailValidation () {
  //     Vue.createApp({
  //       data: () => ({ email: '', password: '', errors: null }),
  //       methods: {
  //         async submitForm() {
  //           const errors = {};
  //           if (!this.email) {
  //             errors.email = 'Email is required';
  //           } else if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.email)) {
  //             errors.email = 'Invalid email';
  //           }
  //
  //           if (Object.keys(errors).length > 0) {
  //             this.errors = errors;
  //             return;
  //           } else {
  //             this.errors = null;
  //           }
  //
  //           // Handle submitting form
  //         }
  //       },
  //       template: `
  // <div>
  //   <form @submit.prevent="submitForm">
  //     <div>
  //       <input v-model="email" placeholder="email" />
  //       <div v-if="errors && errors.email">
  //         {{errors.email}}
  //       </div>
  //     </div>
  //     <div>
  //       <input type="password" v-model="password" />
  //     </div>
  //     <div>
  //       <button type="submit">Register</button>
  //     </div>
  //   </form>
  // </div>
  // `
  //     }).mount('#example2');
    },
    // validateEmail() {
    //   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
    //     this.msg['email'] = 'Please enter a valid email address';
    //   } else {
    //     this.msg['email'] = '';
    //   }
    // },
    // New user data to send forward
    async userData () {
      const newUser = {
        firstName: this.registerFirstName,
        lastName: this.registerLastName,
        username: this.registerUsername,
        email: this.registerEmail,
        password: this.registerPassword
      }
      if (this.registerFirstName !== ""
          && this.registerLastName !== ""
          && this.registerUsername !== ""
          && this.registerPassword !== ""
          && this.registerEmail !== ""
      ) {

        if (this.registerUsername.length < 4) {
          this.registerErrorMessage = "Username must be longer than 4 characters!"
          setTimeout(() => {
            this.registerErrorMessage = null;
          }, 2000);
        } else if (!/^[^@]+@\w+(\.\w+)+\w$/.test(this.registerEmail)) {
          this.registerEmailErrorMessage = "Anna kelvollinen sähköpostiosoite!";
          setTimeout(() => {
            this.registerEmailErrorMessage = null;
          }, 2000);
        } else if (this.registerPassword !== this.registerPasswordRepeat) {
          this.registerPwRepeatErrorMessage = "Salasana on oltava sama!";
          setTimeout(() => {
            this.registerPwRepeatErrorMessage = null;
          }, 2000);
        }
        else {
          console.log("Uus kasutaja")
          const userExisting = await userService.addUser(newUser);
          if (userExisting.error === "username existing") {
            this.usernameExisting = "Käyttäjätunnus on jo olemassa! Vaihda käyttäjätunnus";
            setTimeout(() => {
              this.usernameExisting = null;
            }, 2000);
          } else if (userExisting.error === "email existing") {
            this.registerEmailErrorMessage = "Antamasi sähköpostiosoite on jo olemassa!";
            setTimeout(() => {
              this.registerEmailErrorMessage = null;
            }, 2000);
          }
          else {
            const loggedInUser = await loginService.login({username: this.registerUsername, password: this.registerPassword});
            if (loggedInUser.error !== "login error") {
              this.$emit('register:data', loggedInUser)
            } else {
              console.log("Error with login! " + loggedInUser.error)
            }
          }

        }
      } else {
        this.registerErrorMessage = "Kaikki kentät ovat täytettävä!!"
        setTimeout(() => {
          this.registerErrorMessage = null;
        }, 2000);
      }
      //await userService.addUser(newUser);

      //const loggedInUser = await loginService.login({username: this.registerUsername, password: this.registerPassword});

      //this.$emit('register:data', newUser)
    }
  }
}
</script>

<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
/*#app {*/
/*  font-family: Roboto, Helvetica, Arial, sans-serif;*/

/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  !*color: #2c3e50;*!*/
/*  color: red;*/
/*}*/
/*.error {*/
/*  color: white;*/
/*  background: #f5839c;*/
/*  font-size: 20px;*/
/*  border: solid #f75959;*/
/*  border-radius: 5px;*/
/*  padding: 10px;*/
/*  margin-bottom: 10px;*/
/*}*/
/*.errorImg {*/
/*  width: 50px;*/
/*  margin-left: 20px;*/
/*}*/
</style>