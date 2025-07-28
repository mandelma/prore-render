<template>

  <div>

    <!--    Users {{users}}-->

    <div v-for="user in users" :key="user.id" style="width: 300px; margin: auto; margin-bottom: 5px; border-radius: 5px;">
      <!--      v-if="!user.self"-->
      <p>
        <user
            v-if="!user.self"
            :user="user"
            :firstUser = userFirst
            :selected="selectedUser === user"
            @select="onSelectUser(user)"
        />
      </p>

    </div>


    <message-panel
        v-if="selectedUser"
        :user="selectedUser"
        :initMessages = initMessages
        @new:message="onMessage"
    />


  </div>



  <!--  init messages{{initMessages}}-->

</template>

<script>


import socket from "../../socket";
import User from "./User";
import MessagePanel from "./MessagePanel";

export default {
  name: "chat-io",
  props: {
    me: Object,
    uname: String,
    rm: String,
    isUserRemoved: Boolean
  },
  components: {
    User,
    MessagePanel,

  },
  data() {
    return {
      selectedUser: null,
      users: [],
      room: "",
      firstUser: "",
      user: true,
      initMessages: {},
      //testusers: []
    };
  },
  methods: {


    onMessage(content, date) {
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
      user.hasNewMessages = false;
    },
  },
  mounted() {
    socket.on("init messages", result => {
      this.initMessages = result.messages;
    })

  },

  beforeMount() {
    /*socket.on("init messages", result => {
      this.initMessages = result.messages;
    })*/
  },


  created() {

    socket.on("init messages", result => {
      this.initMessages = result.messages;

    })



    socket.on("connect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }


      });
    });





    socket.on("disconnect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });



    //let results = []
    const initReactiveProperties = (user) => {

      if (this.initMessages.length > 0) {
        console.log("Room vvvvvv" + this.initMessages[0].room)
        this.room = this.initMessages[0].room;
      }


      if (user.room === this.room) {
        user.messages = this.initMessages
      } else {
        user.messages = []
      }
      user.hasNewMessages = false;
    };

    socket.on("get room users", (data) => {
      console.log("Room users: " + data.users.map(us => us.username))
      //this.testusers = data.users
      //const room = data.room;
      data.users.forEach((user) => {
        for (let i = 0; i < this.users.length; i++) {
          const existingUser =  this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;


            return;
          }
        }
        user.self = user.userID === socket.userID;

        // if (!user.self)
        //   this.selectedUser = user;

        initReactiveProperties(user);
        this.users.push(user);
      });

      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    })

    socket.on('get updated room users', (data) => {
      this.users = [];
      data.users.forEach((user) => {
        for (let i = 0; i < this.users.length; i++) {
          const existingUser =  this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;


            return;
          }
        }
        user.self = user.userID === socket.userID;

        if (!user.self)
          this.selectedUser = user;

        initReactiveProperties(user);
        this.users.push(user);
      });
      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    })

    socket.on("user connected", (user) => {
      for (let i = 0; i < this.users.length; i++) {

        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }

      // if (!user.self)
      //   this.selectedUser = user;

      initReactiveProperties(user);
      this.users.push(user);
    });


    socket.on("user disconnected", (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
      //if (this.isUserRemoved) {
      //this.users = this.users.filter(user => user.userID !== id);
      //}

    });

    socket.on("private message", ({ content, date, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
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

.panel {

  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  max-width: 300px;
  height: 300px;
  /*
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  */

  border-radius: 10px;
  border: 1px solid #a6a8a6;


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