<template>

  <div class="select-username">
    <form @submit.prevent="onSubmit">
<!--      <input v-model="username" placeholder="Sinu username..." />
      <input v-model="room" placeholder="Toa number..." />-->
<!--      <button :disabled="!isValid">Send and open chat panel</button>-->
<!--      <button >Send and open chat panel</button>-->
<!--      <MDBBtn size="large" type="submit" color="info" block >Open Chat panel...</MDBBtn>-->
    </form>
  </div>


</template>

<script>
import {
  //MDBBtn
} from "mdb-vue-ui-kit";
export default {
  name: "SelectUsername",
  props: {
    un: String,
    ri: String
  },
  components: {
    //MDBBtn
  },
  data() {
    return {
      username: "",
      room: ""

    };
  },
  computed: {
    isValid() {
      return this.username.length > 2;
    },
  },
  methods: {
    onSubmit() {

      // this.$emit("inpuut", this.username, this.room);
      // this.$emit("inpuut", this.un, this.ri);
    },
    preventDefault() {
      //this.$emit("inpuut", this.un, this.ri);
    }
  },

};
</script>

<style scoped>
/*.select-username {
  width: 300px;
  border: solid black;
  margin: 0;
}*/
</style>
