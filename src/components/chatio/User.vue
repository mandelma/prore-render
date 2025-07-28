
<template >
<!--  @click="onClick"-->
  <div v-if="!user.self" class="user"  :class="{ selected: selected }">

    <div class="description">
<!--      <div class="name" v-if="!user.self">-->
<!--        <div v-if="user.hasNewMessages"  class="new-messages">!</div>-->


<!--        &lt;!&ndash;        {{ status }}&ndash;&gt;-->


<!--      </div>-->

      <div class="status" v-if="!user.self">


        <status-icon
            :user = "user"
            :connected="user.connected"

        />



      </div>

    </div>

  </div>
  <!--  <MDBBtnClose white v-if="!user.self && selected" @click="setUserNotSelected" style="float: right; padding: 7px;" />-->
</template>

<script>
// v-if="user.self || user.name === 'toka' || user.usernmae === 'eka'"
// v-if="user.self && (user.username === 'toka') && (user.username === 'eka')"
//import {MDBBtnClose} from 'mdb-vue-ui-kit'
import StatusIcon from "./StatusIcon";
export default {
  name: "chat-user",
  components: {
    //MDBBtnClose,
    //MDBBadge, MDBBtn,
    StatusIcon
  },
  props: {
    user: Object,

    firstUser: String,
    selected: Boolean,
  },
  data() {
    return{
      isChatOpen: false
    }
  },
  methods: {
    onClick() {
      //console.log("Clicked in user")


      this.$emit("select");
    },
    setUserNotSelected () {
      this.$emit("noSelected");
    }
  },
  computed: {
    status() {
      return this.user.connected ? "Aloita chattailu" : "Olen offline-tilassa Jätä viesti";
    },
  },
};
</script>

<style scoped>
.selected {
  margin: auto;
  width: 300px;
  background-color: transparent;
}

.name {
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

}
.name:hover {
  color: blue;
}

.user {
  padding: 10px;
  margin-top: 50px;
  margin-bottom: 10px;
  border-radius: 10px;
  /*background-color: #0d0c0c;*/
}

.description {
  display: inline-block;
}

.status {
  color: #515358;
}

.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-left: 10px;
}
</style>
