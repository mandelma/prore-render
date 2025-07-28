<template>
  <div>
    <MDBContainer style="margin-top: 50px;">
      <MDBTabs v-model="form7ActiveTab">
        <MDBTabNav pills justify tabsClasses="mb-3" style="margin: auto;">
          <MDBTabItem style="background-color: #37546a; color: #ddd;" @click="pressLoginTab" tabId="ex3-1" href="ex3-1"
          >Kirjaudu</MDBTabItem
          >
          <MDBTabItem style="background-color: #223340; color: #ddd;" @click="pressRegisterTab" tabId="ex3-2" href="ex3-2"
          >Registeröidy</MDBTabItem
          >
        </MDBTabNav>


      </MDBTabs>

      <div v-if="isRegister">
        <Register
          @register:data = handleRegister
        />
      </div>

      <div v-else>
        <Login
            @login:data = userControl
        />
      </div>

    </MDBContainer>

  </div>

</template>

<script>
import Login from '../components/LoginForm.vue'
import Register from '../components/RegisterForm'
import {
  MDBContainer,
  MDBTabs,
  MDBTabNav,
  MDBTabItem,

} from "mdb-vue-ui-kit";
import { ref } from "vue";

export default {
  name: "login-register",
  components: {
    Login,
    Register,
    MDBContainer,
    MDBTabs,
    MDBTabNav,



    MDBTabItem,

  },
  setup() {
    const form7ActiveTab = ref("ex3-1");
    const form2Username = ref("");
    const form2Password = ref("");
    const form7LoginCheck = ref(true);
    const form7RegisterName = ref("");
    const form7RegisterUsername = ref("");
    const form7RegisterEmail = ref("");
    const form7RegisterPassword = ref("");
    const form7RegisterPasswordRepeat = ref("");
    const form7RegisterTermsCheck = ref(true);

    return {
      form7ActiveTab,
      form2Username,
      form2Password,
      form7LoginCheck,
      form7RegisterName,
      form7RegisterUsername,
      form7RegisterEmail,
      form7RegisterPassword,
      form7RegisterPasswordRepeat,
      form7RegisterTermsCheck
    };
  },
  data () {
    return {
      isLogin: true,
      isRegister: false
    }
  },
  mounted () {
    this.isLogin = true
  },
  methods: {
    pressLoginTab () {
      this.isRegister = false
      this.islogin = true
    },
    pressRegisterTab () {
      this.isLogin = false
      this.isRegister = true
    },
    handleRegister (data) {
      console.log("xxxxx-xxxxx")
      this.$emit('register:data', data)
    },
    userControl (userCredentials) {
      this.$emit('login:data', userCredentials)

    }
  }
}
</script>

<style >
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
}

</style>