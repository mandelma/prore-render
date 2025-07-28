<template>
  <div>
    <!--  user {{user}}-->
  </div>
  <p style="font-size: 18px; color: #9ba2a4;">
    <MDBIcon size="2x"><i class="fas fa-user-circle"></i></MDBIcon>
    {{user.username}}
    <i class="icon" :class="{ connected: connected }" style="padding: 10px; margin-left: 10px;"></i>
  </p>
  <!--  <p style="font-size: 18px">-->


</template>

<script>


import {MDBIcon} from "mdb-vue-ui-kit";
//import socket from "@/socket";
//import chatuserService from '../../service/chatUsers'
export default {
  name: "StatusIcon",

  components: {
    MDBIcon
  },
  props: {
    connected: Boolean,
    user: Object
  },
  data() {
    return {
      avatar: null,

      chatavatar: null
    }
  },
  methods: {

  },
  async mounted () {

  }
}
</script>

<style scoped>
.icon {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: #e38968;
  margin-right: 6px;
}

.icon.connected {
  background-color: #86bb71;
}
</style>