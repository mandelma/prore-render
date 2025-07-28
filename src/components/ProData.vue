<template>
  <MDBContainer>
    <MDBRow>
      <MDBCol>
        <img style="width: 100px;" :src="proAvatar ? proAvatar : require(`@/assets/avatar/avatar.png`)" alt="pro-image"/>
      </MDBCol>
      <MDBCol>
        <p>{{proInfo}}</p>
      </MDBCol>
    </MDBRow>


  </MDBContainer>
</template>

<script>
import {
  MDBContainer, MDBRow, MDBCol, //MDBTextarea
} from 'mdb-vue-ui-kit'

//import RatingStars from "@/components/RatingStars";
export default {
  name: "ProData",
  props: {
    proAvatar: null,
    proInfo: String
  },
  components: {
    //RatingStars,
    MDBContainer,
    MDBRow,
    MDBCol,
    //MDBTextarea
  },
  data () {
    return {
      feedback: "",
      rating: 0
    }
  }
 }
</script>

<style scoped>

</style>