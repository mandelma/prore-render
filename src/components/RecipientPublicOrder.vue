<template>
  <MDBContainer>
    <MDBBtn block outline="success" size="lg>">Lähettää tilaus</MDBBtn>
  </MDBContainer>
</template>

<script>
import {
    MDBContainer,
    MDBBtn
} from 'mdb-vue-ui-kit'
export default {
  name: "RecipientPublicOrder",
  props: {

  },
  components: {
    MDBContainer,
    MDBBtn
  }
}
</script>

<style scoped>

</style>