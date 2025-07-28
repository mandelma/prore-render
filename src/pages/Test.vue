<template>

  <div>

    Users {{users}}

    <div class="scrolling-wrapper" >
      <div

          class="card"
          v-for="user in users"
          :key="user.userID"
      >
        <h2>
          <user

              :user="user"
              :firstUser = userFirst
              :selected="selectedUser === user"
              @select="onSelectUser(user)"
          />
        </h2>

      </div>




    </div>
    <message-panel
        v-if="selectedUser"
        :user="selectedUser"
        @new:message="onMessage"
    />
    <MDBRow>

    </MDBRow>
    <MDBRow>
      <MDBCol>

      </MDBCol>

      <MDBCol >


      </MDBCol>
    </MDBRow>
  </div>



</template>

<script>

import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
//import 'vue3-carousel/dist/carousel.css'
//import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import socket from "../../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";
import {
  ref,
  //watch
} from 'vue'
//const username = "ddd"
//const room = "test-room"

export default {
  name: "test",
  props: {
    me: Object,
    uname: String,
    rm: String
  },
  components: {
    User,
    MessagePanel,
    MDBRow,
    MDBCol,

    //Carousel,
    //Slide,
    //Pagination,
    //Navigation
  },
  setup () {
    const selectedUser = ref(null)
    const users = ref([])
    return {
      selectedUser,
      users
    }
  },
  data() {
    return {



      user: true
    };
  },
  methods: {
    onMessage(content, date) {
      //console.log("Is message here??? " + date)
      //console.log("Selected user: " + this.selectedUser.username);
      if (this.selectedUser) {
        console.log("Selected user: " + this.selectedUser.username);
        socket.emit("private message", {
          content,
          date,
          to: this.selectedUser.userID,
        });
        this.selectedUser.messages.push({
          content,
          date,
          fromSelf: true,
        });
      }
    },
    onSelectUser(user) {
      if (!user.self) {
        this.selectedUser = user;
      }
      //this.selectedUser = user;
      user.hasNewMessages = false;
    },
  },
  mounted() {
    //location.reload()
  },

  created() {
    const username = this.uname
    const room = this.rm;
    socket.emit("joinRoom", {username, room})

    socket.on('message', (message) => {
      console.log("Message in user room " + message.text);
      //outputMessage(message);

      // Scroll down
      //chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Get room and users
    socket.on('roomUsers', ({ room, users }) => {
      console.log("Room -- " + room)
      //console.log("Users in room -- " + users.length)
      // outputRoomName(room);
      // outputUsers(users);







      users.forEach((user) => {

        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          existingUser.connected = user.connected;
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        //if (user.username === this.me.username) {
        //if ((user.username === "eka" || user.username === "toka"))
        this.users.push(user);

        if (user.self) {
          user.connected = true;
        }
        // ooooooooo

        //}

      });

      console.log("Users length: " + this.users.length)

      //console.log("xxxxxxx--xxx " + )
      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });








    socket.on("connect", () => {
      console.log("Connect")
      socket.on('user connected', (data) => {
        console.log("True or false: " + data.userID)

        this.users.forEach((user) => {
          console.log("Help")
          if(user.userID === data.userID)
            console.log("jaa on??? " + user.userID)
          user.connected = true;
          // if (user.self) {
          //   console.log("user is self-----")
          //   user.connected = true;
          // }
        });
      })
      //const room = "xxXXxx"
      //socket.emit('create-room', room);

      // const room = 1000
      // const name = "Tiiu"
      // socket.emit('join-room', { name, room }, (error) => {
      //   if (error) {
      //     alert(error);
      //   }
      // })

      // socket.on('connectToRoom',function(data){
      //   // document.body.innerHTML = '';
      //   // document.write(data);
      //   console.log("Your room: " + data)
      // });

      // this.users.forEach((user) => {
      //   console.log("Help")
      //   if (user.self) {
      //     console.log("user is self-----")
      //     user.connected = true;
      //   }
      // });
    });

    socket.on("disconnect", () => {

      console.log("Disconnect")
      socket.to('user disconnected', (data) => {
        console.log("Is user disconnected??? id " + data)
        this.users.forEach((user) => {
          console.log("Help in disconnect")
          if (user.userID === data) {

            user.connected = false;
          }
        });
      })
      // this.users.forEach((user) => {
      //   if (user.self) {
      //     user.connected = false;
      //   }
      // });

      // socket.on('roomUsers', ({ room, users}) => {
      //
      // })

      socket.on('roomUsers', ({ room, users }) => {
        console.log("Room in disconnect -- " + room)
        console.log("Users in room after disconnect-- " + users.length)
        // outputRoomName(room);
        // outputUsers(users);


        this.users = []
        users.forEach((user) => {

          for (let i = 0; i < this.users.length; i++) {
            const existingUser = this.users[i];
            existingUser.connected = false;
            if (existingUser.userID === user.userID) {
              existingUser.connected = false   //user.connected;
              return;
            }
          }
          user.self = user.userID === socket.userID;
          initReactiveProperties(user);
          user.connected = false;
          //if (user.username === this.me.username) {
          //if ((user.username === "eka" || user.username === "toka"))
          this.users.push(user);


          //}
          //this.users.push(user);
        });

        console.log("Users length: " + this.users.length)

        //console.log("xxxxxxx--xxx " + )
        // put the current user first, and sort by username
        this.users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
      });

    });





    const initReactiveProperties = (user) => {
      user.messages = [];
      user.hasNewMessages = false;
    };






    // socket.on("users", (users) => {
    //   users.forEach((user) => {
    //     for (let i = 0; i < this.users.length; i++) {
    //       const existingUser = this.users[i];
    //       if (existingUser.userID === user.userID) {
    //         existingUser.connected = user.connected;
    //         return;
    //       }
    //     }
    //     user.self = user.userID === socket.userID;
    //     initReactiveProperties(user);
    //     //if (user.username === this.me.username) {
    //     //if ((user.username === "eka" || user.username === "toka"))
    //       this.users.push(user);
    //     //}
    //     console.log(this.users[0].username)
    //     //this.users.push(user);
    //   });
    //   // put the current user first, and sort by username
    //   this.users.sort((a, b) => {
    //     if (a.self) return -1;
    //     if (b.self) return 1;
    //     if (a.username < b.username) return -1;
    //     return a.username > b.username ? 1 : 0;
    //   });
    //
    //
    //
    // });

    // socket.on("user connected", (user) => {
    //   for (let i = 0; i < this.users.length; i++) {
    //     const existingUser = this.users[i];
    //     existingUser.connected = true;
    //     if (existingUser.userID === user.userID) {
    //       existingUser.connected = true;
    //       return;
    //     }
    //   }
    //   initReactiveProperties(user);
    //   //if ((user.username === "eka" || user.username === "toka") )
    //
    //     this.users.push(user);
    //   //console.log("users +++ " + this.users[0])
    // });

    // socket.on("user disconnected", (id) => {
    //   for (let i = 0; i < this.users.length; i++) {
    //     const user = this.users[i];
    //     if (user.userID === id) {
    //       user.connected = false;
    //       break;
    //     }
    //   }
    // });

    socket.on("private message", ({ content, date, from, to }) => {

      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;

        // user.messages.push({
        //   content,
        //   date,
        //   fromSelf,
        // });

        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            date,
            fromSelf,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  unmounted() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  },
};
</script>

<style scoped>
.scrolling-wrapper {
  margin: 0 auto;
  max-width: 300px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.card {
  display: inline-block;

}




ul {
  list-style: none;
}

li {
  display: inline-block;

  margin-right: 10px; /* add spacing between items */
}


.left-panel {
  position: fixed;
  left: 0;
  top: 300px;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
