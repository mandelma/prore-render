<template>
  <div>
    Here is a test chat
    <MDBContainer class="chat-panel">
      <div class="App">
        <form @submit.prevent="submitToken">
          <input type="text" placeholder="Enter token" v-model="token" />
          <button type="submit">Submit</button>
        </form>
        <div class="box">
          <div class="messages">
            <div v-for="user in messages" :key="user.id">
              {{user.name}}: {{user.message}}
            </div>
          </div>
          <div class="messages"></div>
          <form class="input-div" @submit.prevent="submitMessage">
            <input type="text" placeholder="Type in text" v-model="inputMessageText" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>



      <div class="panel">
        <div class="messages" ref="messagesRef">
          <div class="inner">
            <div v-for="(message, index) in messages"
                 :key="index"
                 class="message"
            >
              {{message.username}}
              <!--
              <div v-if="message.uid === uuid" class="user-self">
                You: &nbsp;
              </div>
              <div v-else class="user-them">
                Them: &nbsp;
              </div>
              -->
              <div class="text">{{message.message}}</div>


            </div>
          </div>

        </div>
        <form @submit.prevent="submit">

          <input
              v-model="newMessage"
          />
          <button>+</button>
        </form>
      </div>
    </MDBContainer>
  </div>
  {{user.username}}
  ----------------------------
  username on: {{username}}


</template>

<script>
import SocketioService from '../service/socketio.service.js';

import {
  MDBContainer
} from "mdb-vue-ui-kit";
import io from "socket.io-client";


// "socket.io-client": "^4.6.2",
// examples/private-messaging

// const SENDER = {
//   id: "1254555",
//   name: "Paul"
// };

export default {
  name: "ChatApp",
  props: {
    user: Object
  },
  components: {

    MDBContainer
  },
  data: function () {
    return {
      msg: "",
      sender: this.user.username,
      username: "",
      token: '',
      socket: io("ws://localhost:3002", {
        withCredentials: true,
        transports: ['websocket']
      }),
      inputMessageText: "",
      messages: [],
      users: [],
      dialog: true,
      showChat: false,
    };
  },
  created() {
    //SocketioService.setupSocketConnection();

  },
  mounted () {
    //this.joinServer()

  },
  methods: {
    submitToken() {
      console.log(this.token);
      SocketioService.setupSocketConnection(this.token);
      SocketioService.subscribeToMessages((err, data) => {
        console.log(data);

        this.messages.push(data);
      });
    },
    joinServer () {
      this.socket.on("loggedIn", (data) => {
        this.messages = data.messages;
        this.users = data.users;
      });
      //this.listen();
    },
    submitMessage() {

      const CHAT_ROOM = "myRandomChatRoomId";
      const message = this.inputMessageText;
      SocketioService.sendMessage({message, roomName: CHAT_ROOM}, cb => {
        // callback is acknowledgement from server
        console.log("xxxxxx" + cb);
        // this.messages.push({
        //   message,
        //   ...SENDER
        //
        // });

        // clear the input after the message is sent
        this.inputMessageText = '';
      });
    }
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style scoped>

.App {
  padding: 1rem;
}

.box {
  width: fit-content;
  height: 400px;
  border: solid 1px #000;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.messages {
  flex-grow: 1;
}

.input-div {
  display: flex;
  width: 100%;
}

</style>