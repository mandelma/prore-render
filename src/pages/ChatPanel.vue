<template>

  <!-- public/index.html -->

  <div class="panel-heading">
    Group Chats <span class="badge"></span>
  </div>
  <div class="panel-body" style="margin-top: 100px;">
    <div v-if="joined">
      <em><span v-text="status"></span></em>
      <ul class="chat">
        <li class="left clearfix" v-for="(message, i) in messages" :key="i">
          <div class="chat-body clearfix">
            <div class="header">

              <strong class="primary-font">



              </strong>
            </div>
            <p>

            </p>
          </div>
        </li>
      </ul>
      <div class="panel-footer">
        <div class="input-group">
          <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Type your message here..." v-model="newMessage" @keyup.enter="sendMessage">
          <span class="input-group-btn">
          <button class="btn btn-primary btn-sm" id="btn-chat" @click="sendMessage">Send</button>
            <button class="btn btn-primary btn-sm" id="btn" @click="goOut">Out</button>
        </span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="enter your username to join chat" v-model="username" @keyup.enter="joinChat">
      </div>

      <button  @click="joinChat">JOIN</button>

    </div>

  </div>

  members {{members.count}}


  <MDBContainer class="chat-panel">

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
  <div v-if="stopped" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>

  {{loggedInUser}}
  ----------------
  {{userToContact}}

</template>

<script>
/* eslint-disable */

// const pusher = new Pusher('f4971ff2b19d74acbb57', {
//   cluster: 'eu',
//   encrypted: true,
//   authEndpoint: '/api/pusher/auth',
//
//   //channelAuthorization: { endpoint: "/pusher/auth"}
// });

import {
  MDBContainer
} from "mdb-vue-ui-kit";
//import AgoraRtm from 'agora-rtm-sdk';
//import Pusher from 'pusher-js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ref,
  onMounted,
  //nextTick
    } from 'vue';
import chatService from '../service/chat'
const APP_ID = '6d18a78587044be0843207303757c771';
const CHANNEL = 'ddd';      //'wdj';
//const client = AgoraRtm.createInstance(APP_ID);
const uid = uuidv4();
//const uid = "123"
let channel;


export default {
  name: "chat-panel",
  components: {
    MDBContainer
  },
  props: {
    loggedInUser: Object,
    userToContact: String
  },
  data () {
    return {
      joined: false,
      username: '',
      members: '',
      membersCount: null,
      newMessage: '',
      messages: [],
      status: '',

    }
  },
  setup () {
    //const username = ref('username')
    const message = ref("")

    // const submit = async () => {
    //   await fetch('http://localhost:8080/api/messages', {
    //     method: 'POST',
    //     headers: {'content-type': 'application/json'},
    //     body: JSON.stringify({
    //       userId: '640d9ec449f4c03dc724b428',
    //       username: "Tiit",
    //
    //       message: message.value
    //     })
    //   })
    //   message.value = '';
    //
    // }
    onMounted (() => {
      //Pusher.logToConsole = true;

      // const channel = pusher.subscribe('chat');
      // channel.bind('message', data => {
      //   //app.messages.push(JSON.stringify(data));
      //   //if (data.userId === '640d9ec449f4c03dc724b428')
      //     messages.value.push(data);
      //
      // });


    })
    const uuid = ref(uid)
    const text = ref("")

    const messages = ref([])
    const messagesRef = ref(null)


    let stopped = ref(false)
    return {
      //username,
      message,

      //submit,
      uuid,
      text,

      messages,
      messagesRef,

      stopped
    }
  },

  async mounted () {
    //console.log("Logged user in chat panel: " + this.loggedInUser.username)

    // await client.login({uid, token: null});
    // channel = await client.createChannel(CHANNEL);
    // await channel.join();
    // channel.on("ChannelMessage", (message, peerId) => {
    //   this.messages.push({text: message.text, uid: peerId});
    // })

    //this.loginRTM();
  },

  methods: {
    // incomingChat (chatMessage) {
    //   console.log("Incoming chat " + chatMessage.message);
    // },
    submit () {
      console.log("Submitted")
      this.sendMessage()
    },

    async joinChat() {
      // const pusher = new Pusher('f4971ff2b19d74acbb57', {
      //   cluster: 'eu',
      //   userAuthentication: {
      //     endpoint: "/api/pusher/user-auth",
      //     transport: "ajax",
      //     params: {},
      //     headers: {},
      //     paramsProvider: null,
      //     headersProvider: null,
      //     customHandler: null,
      //   },
      // });


      await axios.post('/api/join-chat', {username: this.username})
          .then(response => {
            // User has joined the chat
            this.joined = true;
            const channel = pusher.subscribe('presence-test');

            channel.bind('pusher:subscription_succeeded', (members) => {
              this.members = channel.members;
            });
            // User joins chat
            channel.bind('pusher:member_added', (member) => {
              this.status = `${member.id} joined the chat`;
            });



            // Listen for chat messages
            this.listen();
          });
    },
    async joinPrivateChat() {

      await axios.post('/api/join-private-chat', {username: this.username})
          .then(response => {
            // User has joined the chat
            this.joined = true;
            //const channel = pusher.subscribe('presence-test');

            const channel = pusher.subscribe("private-channel-" + this.username);


            // User joins chat
            channel.bind('pusher:member_added', (member) => {
              this.status = `${member.id} joined the chat`;
            });



            // Listen for chat messages
            this.listen();
          });
    },
    async sendMessage() {
      // groupChat



      let message = {
        username: this.username,
        otherUser: this.userToContact,
        message: this.newMessage
      }
      // Clear input field
      this.newMessage = '';
      await axios.post('/api/send-message', message);
      //pusher.sendToUser('mama', 'message', {message: 'Hello lana'})
    },
    listen() {
      //const channel = pusher.subscribe('presence-test');
      const channel = pusher.subscribe('private-channel-' + this.username);
      channel.bind('message', (data) => {
        this.messages.push({
          username: data.username,
          message: data.message
        });
      });

    },
    goOut () {
      pusher.unsubscribe('presence-test', (members) => {
        this.members = channel.members
        console.log("Members.... " + members)
      });


      this.joined = false;
    },

    sendaMessage () {
      if (this.text === "") return;
      channel.sendMessage({text: this.text, type: "text"});
      //this.messages.push({text: this.text, uid});
      this.apendMessage({text: this.text, uid})
      this.text = "";
    },
    async apendMessage (message) {
      this.messages.push(message);
      //await nextTick();
      this.messagesRef.scrollTop =
          this.messagesRef.scrollHeight;
    }

  }
}
</script>

<style scoped>
.chat-panel {
  margin-top: 50px;
  height: 400px;
  /*
  background: linear-gradient(
      90deg,
      rgba(188, 255, 147, 1) 0%,
      rgba(88, 245, 158, 1) 53%,
      rgba(0, 237, 69, 1) 100%
  );
  */

}
.chat-panel:hover {
  overflow-y: hidden;
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
  border: 1px solid green;


}
.messages {
  text-align: left;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  scrollbar-face-color: red;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: white;
}
.messages:hover {

}

.user-self {

  text-align: right;
  color: blue;
}
.user-them {

  color: red;
}
.inner {
  padding: 10px;
}

form{
  position: relative;
  display: flex;
}

.text {
  width: 50%;
  overflow-wrap: break-word;

}



input {
  width: 100%;
  border: none;
  height: 20px;
  padding: 20px;
  border-top: 1px solid #999;
  border-radius: 0;
  outline: none;
}

button {
  border: none;
  outline: none;
  background: none;
  position: absolute;

  right: 3px;
  top: 4px;
  font-size: 24px;
}



</style>