<template>
  <div v-if="feedback.length > 0" style="background-color: darkslategrey; padding: 12px;">
    <MDBListGroup light small style="text-align: left; margin-bottom: 10px;" v-for="data in feedback" :key="data.id">
      <div v-if="data.neg">
        <MDBListGroupItem style="background-color: darkslategrey; color: #dddddd;">{{ data.neg }}</MDBListGroupItem>
      </div>
<!--      <div v-else>-->
<!--        <h3>Ei vielä arvostelua</h3>-->
<!--      </div>-->



    </MDBListGroup>
    <MDBBtn block outline="danger" size="lg" @click="closeFeedback">Poistu kommenteistä</MDBBtn>
  </div>
  <div v-else style="background-color: darkslategrey; padding: 12px;">
    <h3  style="color: yellowgreen; float: right; cursor: pointer" @click="closeFeedback">Valmis</h3><br><br>
    <h3>Ei vielä arvostelua</h3>


  </div>
</template>

<script>
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn
}from "mdb-vue-ui-kit";

export default {
  name: "negative-feedback",
  props: {
    feedback: Array
  },
  components: {
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn
  },
  data() {
    return{

    }
  },
  methods: {
    closeFeedback () {
      this.$emit('close:comments', false)
    }
  }
}
</script>

<style scoped>

</style>