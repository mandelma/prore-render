<template>
  <MDBContainer>
    <div class="edit-price">
      <error-msg :message = priceErrorMessage />
      <div style="display: flex; justify-content: right;">
        <MDBBtnClose white style="padding: 13px; cursor: pointer;" @click="cancelEdit" />

      </div>

      <MDBInput type="Number" label="Uusi tuntihinta" size="lg" white v-model="price" wrapperClass="mb-4"/>

      <MDBBtn outline="success" block size="lg" style="margin-bottom: 20px;" @click="handleEditPrice">Kinnita</MDBBtn>
<!--      <MDBBtn outline="danger" block size="lg" @click="cancelEdit">Poistu</MDBBtn>-->
    </div>

  </MDBContainer>
</template>

<script>

import {
  MDBContainer,
  MDBBtn,
  MDBInput,
  MDBBtnClose
  //MDBIcon
}from "mdb-vue-ui-kit";
import {ref} from "vue";
import errorMsg from '.././components/notifications/errorMessage'
export default {
  name: "edit-price",
  props: {
    currentPrice: Number
  },
  setup () {
    const price = ref(null)
    const priceErrorMessage = ref(null)
    return {
      price,
      priceErrorMessage
    }
  },
  components: {
    errorMsg,
    MDBContainer,
    MDBBtn,
    MDBInput,
    MDBBtnClose
    //MDBIcon
  },
  data () {
    return {
      errorMessage: null
    }
  },
  methods: {
    handleEditPrice () {
      const priceInt = parseInt(this.price);

      if (this.price) {
        if (priceInt > 0) {
          console.log("Pos")
          this.$emit('save:editedPrice', this.price);

        } else {
          this.price = null;
          this.priceErrorMessage = "Hinta ei voi olla negatiivinen numero!"
          setTimeout(() => {
            this.priceErrorMessage = null;
          }, 3000);
        }

      } else {
        this.priceErrorMessage = "Tuntihinta puuttuu!"
        setTimeout (() => {
          this.priceErrorMessage = null;
        }, 3000);
      }
    },
    cancelEdit () {
      this.$emit('cancel:editPrice' , false)
      this.errorMessage = "Here is some error!"

    }
  }
}
</script>

<style scoped>

</style>