<template>
  <MDBContainer>
    <MDBBtn v-if="!isToken " block outline="warning" @click="handleOpenForm">Aloita salasanan vaihtamista</MDBBtn>
    <form v-else style="margin-top: 100px;" @submit.prevent="handleSubmitReset">

      <MDBInput
          type="password"
          size="lg"
          label="Uusi salasana"
          white
          v-model="newPw"
          wrapperClass="mb-4"
      />

      <MDBInput
          type="password"
          size="lg"
          label="Toista salasana"
          white
          v-model="confirmNewPw"
          wrapperClass="mb-4"
      />

<!--      <button type="submit" class="btn btn-primary btn-block">Varmista uusi salasana</button>-->
      <MDBBtn block type="submit" outline="success">Varmista uusi salasana</MDBBtn>
<!--      <h3> Reset password</h3>-->
<!--      <div class="form-group">-->
<!--        <label>Uusi salasana</label>-->
<!--        <input type="password" class="form-control" placeholder="Uusi salasana" v-model="newPw"/>-->

<!--      </div>-->
<!--      <div class="form-group">-->
<!--        <label>Toista salasana</label>-->
<!--        <input type="password" class="form-control" placeholder="Toista salasana" v-model="confirmNewPw"/>-->

<!--        <button type="submit" class="btn btn-primary btn-block">Submit</button>-->
<!--      </div>-->
    </form>
    <success-message
        :message = successInfo
    />

    <error-message
        :message = errorInfo
    />
<!--    <p style="color: white;">Token {{token}}</p>-->
  </MDBContainer>

</template>

<script>
import authService from '../service/pwAuth'
import successMessage from '../components/notifications/successMessage'
import errorMessage from '../components/notifications/errorMessage'
import {
  MDBContainer,
    MDBInput,
    MDBBtn
} from 'mdb-vue-ui-kit'
export default {
  name: "Reset",
  components: {
    successMessage,
    errorMessage,
    MDBContainer,
    MDBInput,
    MDBBtn
  },
  data () {
    return {
      newPw: "",
      confirmNewPw: "",
      isToken: false,
      token: this.$route.params.token,
      successInfo: null,
      errorInfo: null
    }
  },

  methods: {
    async handleOpenForm () {
      const result = await authService.reset(this.token)
      if (result === "valid") {
        console.log("Token " + result)
        this.isToken = true;
      } else {
        console.log("Token " + result )
        this.errorInfo = result;
        setTimeout(() => {
          this.errorInfo = null
          this.$router.push('/forgot_auth')
        }, 3000)

      }

    },
    async handleSubmitReset () {
      if (this.newPw !== this.confirmNewPw) {
        this.errorInfo = "Salasana on oltava sama!"
        setTimeout(() => {
          this.errorInfo = null
        }, 3000)
      } else {
        const auth = await authService.resetAuth({
          token: this.token,
          password: this.newPw
        })
        console.log("Auth--- " + auth);
        if (auth) {
          this.successInfo = "Salasanan luonti onnistui!"
          setTimeout(() => {
            this.successInfo = null
            this.$router.push('/login')
          }, 3000)

        }
      }


    }
  }
}
</script>

<style scoped>
.error {
  color: white;
  background: #f5839c;
  font-size: 20px;
  border: solid #f75959;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>