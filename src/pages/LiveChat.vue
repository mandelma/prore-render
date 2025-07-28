
<template>
  <MDBContainer style="">
    <!--    v-if="chatusers.length > 0"-->
    <div>




      <div v-if="chatusers.length > 0">
        <div v-for="(user, i) in chatusers" :key="i">
          <User
              :user = user
              :selected="selecteduser === user"
              @noSelected = noSelected
              @select="selectUser(user)"
          />
        </div>



        <MessagePanel
            v-if="selecteduser"
            :test = test
            :user="selecteduser"
            :messages = messages
            @new:message="onMessage"
        />



      </div>
      <!--      <div v-else style="margin-top: 100px;">

              <h2 >Valitse käyttäjä Ylhältä chat merkista!</h2>
            </div>-->
    </div>

<!--        Selecteduser live chat {{selecteduser}}-->

  </MDBContainer>

</template>

<script>
/* eslint-disable */

// v-if="!usernameAlreadySelected"

import { MDBContainer} from 'mdb-vue-ui-kit';

//import SelectUser from '../components/chatio/SelectUser.vue'
//import chat from '../components/chatio/Chat.vue'

//import providerPanel from'./ProviderPanel.vue'
import User from "../components/chatio/User.vue"
import MessagePanel from "../components/chatio/MessagePanel.vue"
import socket from '../socket'
import infoMessage from "@/components/notifications/infoMessage";


export default {
  name: "live-chat",
  props: {
    creditLeft: null,
    userIsProvider: null,
    isSelectedByExpiredUser: Boolean,
    test: Boolean,
    //selectedUser: Object,
    selecteduser: null,
    //test: String,
    chatusers: Array,

    isAccessDenied: Boolean,

    messages: Array,
    newMessageRoom: String,
    loggedInUser: Object,
    bookings: Array,
    bookingsHistory: Array,
    un: String,
    ri: String
  },
  components: {
    User,
    MessagePanel,
    infoMessage,
    //providerPanel,
    MDBContainer
    //MDBBtn,
    //SelectUser,
    //chat
  },
  data() {
    return {
      tabFocus: false,
      user: {},
      selectedUser: null,
      users: [],
      msg: "",
      messageAboutCredit: "Lataa lisää aikaa!",
      //messages: [],
      userId: null,
      username: "",
      room: "",
      count: 0
    };
  },

  created() {
    //this.detectFocusOut();


    // document.addEventListener("visibilitychange", () => {
    //
    //   // use the document's hidden property to check if the current tab is active!
    //   if (document.hidden) {
    //     //output.innerHTML += "browser tab is changed </br>";
    //     console.log("Tab is changed")
    //   } else {
    //     //output.innerHTML += "Browser tab is again active! </br>";
    //     console.log("Tab is not changed")
    //   }
    // });
  },

  watch:{
    tabFocus(value) {
      console.log("New value:", value);
    },
  },

  methods: {
    lataa () {
      this.$router.push('/pay-plan')
    },
    // detectFocusOut() {
    //   let inView = false;
    //
    //   const onWindowFocusChange = (e) => {
    //     if ({ focus: 1, pageshow: 1 }[e.type]) {
    //       if (inView) return;
    //       this.tabFocus = true;
    //       inView = true;
    //       this.$emit("wentOut")
    //     } else if (inView) {
    //       this.tabFocus = !this.tabFocus;
    //       inView = false;
    //     }
    //   };
    //
    //   window.addEventListener('focus', onWindowFocusChange);
    //   window.addEventListener('blur', onWindowFocusChange);
    //   window.addEventListener('pageshow', onWindowFocusChange);
    //   window.addEventListener('pagehide', onWindowFocusChange);
    // },

    sendMessage: function () {
      if (this.msg !== "") {
        socket.emit("msg", this.msg);
        this.msg = "";
      }
    },
    startChat () {
      let room = "userdialog";
      let username = "eka"
      socket.emit('credentials', {
        userID: this.loggedUser.id,
        username: username,
        room: room
      })
    },
    submit() {
      let username = "toka"
      let id = "3333333--33333"
      let room = "room-dialog"
      //socket.emit("newUser", username, id, room);
    },


    selectUser(user) {
      this.$emit("select:user", user)
      this.selectedUser = user;
    },

    noSelected () {
      this.$emit("noSelected");
    },


    onMessage(content, blob, date) {
      this.$emit("on:message", content, blob, date);
    },

    renderChat () {
      this.count ++
    },
    newChat () {
      console.log("Aaaaaaaa")
      let username = "alla";
      let room = "tuba";

      this.usernameAlreadySelected = true;
      socket.auth = { username, room };
      socket.connect();
    },

    onUsernameSelection(username, room) {



      this.username = username;
      this.room = room;

      this.usernameAlreadySelected = true;
      socket.auth = { username, room };
      socket.connect();
    },

    updateRoom() {
      //this.removeChatUser();

      socket.emit('updateRoom', "uus-tuba");
      //socket.emit('joinAllRooms')
      socket.on("get room users", (users) => {
        this.users = users
      })
      this.socketResetTest();
      //location.reload();

    },
    removeChatUser () {
      console.log("Remove chat user")

      socket.emit('unsubscribe')
      window.localStorage.removeItem('sessionID')
      //this.isUserRemoved = true;
      socket.on("get room users", (users) => {
        this.users = users
      })

      location.reload()

    },
  },

  computed: {
    isValid() {
      return this.msg.length > 0;
    },
  },


  mounted() {

    //this.joinServer();
  },

  unmounted() {
    if (this.currentRouteName !== '/chat') {
      this.noSelected();
      console.log("Ei ole see router");

    }
  }
}
</script>

<style scoped>
/*body {*/
/*  margin: 0;*/
/*}*/


/*@font-face {*/
/*  font-family: Lato;*/
/*  //src: url("/fonts/Lato-Regular.ttf");*/
/*  src: "~/public/fonts/Lato-Regular.ttf";*/
/*}*/


.chatPanel {

  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
  margin-top: 200px;
}
</style>
