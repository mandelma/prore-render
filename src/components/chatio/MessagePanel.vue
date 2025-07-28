<template>
  <div v-if="isImageZoom" class="chatImageZoomedContainer">
    <div style="display: flex; justify-content: right; padding: 20px;">
<!--      <MDBBtnClose white size="lg"/>-->
      <p style="cursor: pointer;" @click="isImageZoom = false">Valmis</p>
    </div>

    <img class="chatImageZoomed" :src="imageToZoom" alt="zoomed"/>
  </div>

<!--  messages {{messages}}-->

  <div>
    <div v-if="userIn" class="panel">
      <div style="overflow-y: auto;" class="messages" ref="chatArea">
        <div class="inner" ref="refscrollHeight">
          <div >
            <div >
              <div class="messagesBody" >
                <div v-for="(message, index) in messages" :key="index">
                  <div class="messageRow" v-if="message.userID !== userIn.id">

                    <div >
                      <div class="displayName"><MDBIcon size="2x"><i class="fas fa-user-circle"></i></MDBIcon>   {{message.username}}</div>
                      <div  class="messageBlue">
                        <div>
                          <div v-if="message.content.msg_status === 'file'">
<!--                            <img style="width: 160px; cursor: pointer;" :src="message.is_db_image ?-->
<!--                            require(`/server/uploads/chat_images/${message.image}`) : message.image" @click="zoomChatImage(message.image)" alt="chat-img"/>-->
                            <img style="width: 160px; cursor: pointer;" :src="message.image" @click="zoomChatImage(message.image)" alt="chat-img"/>
                          </div>

                          <p class="messageContent">{{message.content.body}}</p>

                        </div>
                        <div class="messageTimeStampRight">{{message.date}}</div>
                      </div>

                    </div>
                  </div>
                  <div v-else class="messageRowRight">
                    <div class="messageOrange">
                      <div v-if="message.content.msg_status === 'file'">
<!--                    <img style="width: 160px;" :src="message.is_db_image ? require(`/server/uploads/chat_images/${message.image}`) : message.image" @click="zoomChatImage(message.image)"/>-->
                        <img style="width: 160px;" :src="message.image" @click="zoomChatImage(message.image)" alt="chat-img"/>

                      </div>



                      <p class="messageContent">{{message.content.body}}</p>
                      <div class="messageTimeStampRight">{{message.date}}</div>

                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
    <div style="border: 1px solid blue; padding: 20px;" v-if="files">
      <div style="display: flex; justify-content: right;">
        <h4 style="cursor: pointer;" @click="files = null">X</h4>
      </div>
      <img style="width: 300px;" :src="blob"/>
    </div>
    <form @submit.prevent="onSubmit">
      <input  id="file-upload" type="file" @change="handleImageChange($event)"/>
      <label  for="file-upload" class="custom-image-upload">
        <MDBIcon>
          <i class="far fa-image"></i>
        </MDBIcon>
      </label>
      <textarea
          style="padding: 20px; background-color: #292424; color: ghostwhite;" id="myInput"
          v-model="msg"
          @keypress="handleInput"
          ref="textarea"
          :placeholder = 'files ? "Lisää kuvaan kuvaus..." : "Kirjoita viesti..."'
      >
    </textarea>


      <button :disabled="!isValid" class="sender">
        <img
            :class="{'sender-btn-disabled': !isValid}"
            style=" padding: 3px 13px;"
            alt="send"
            :src="require(`@/assets/send.png`)"
        />
      </button>
    </form>
  </div>


</template>

<script>
/* eslint-disable */
// document.querySelector('textarea').addEventListener("input", function(){
//   this.style.height = '0px';
//   this.style.height = this.scrollHeight + 'px';
// })

//import StatusIcon from "./StatusIcon";
//import {ref} from "vue";
import {MDBIcon, MDBBtnClose} from 'mdb-vue-ui-kit'
import dateFormat from 'dateformat'
import imageService from '../../service/image'
import awsUploadService from '@/service/awsUploads'
import socket from "@/socket";
import { ref, nextTick, onUpdated } from 'vue'
//import { ref } from "vue";



export default {
  name: "MessagePanel",
  components: {
    MDBIcon,
    MDBBtnClose
    //StatusIcon,
  },
  props: {
    test: Boolean,
    user: Object,
    messages: Array,
    initMessages: Array
  },
  data() {
    return {
      userIn: null,
      msg: "",
      files: null,
      filename: "",
      blob: null,
      imageSearch: null,
      imageToZoom: null,
      isImageZoom: false,
      expand_message:true
    };
  },
  setup () {
    let chatArea = ref(null)
    let refscrollHeight = ref(null)

    const update = () => {
      nextTick(() => {

        chatArea.value.scrollTo({
          behavior: 'smooth',
          top: refscrollHeight.value.clientHeight,
        })
      })
    }

    onUpdated(update)
    return {
      update,
      chatArea,
      refscrollHeight,
    }
  },
  watch: {

    // scroll to end when message send or select another chat
    messages: async function () {
      console.log("Watching...");
      await this.scrollToEnd();
    }

  },

  mounted () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.userIn = user;

      document.getElementById('myInput').style.height = "40px"


    }
  },

  methods: {
    resize () {
      //console.log("Testaus " + event.target.style.height)

      let element = this.$refs["textarea"];
      element.style.height = 20 + "px";
      element.style.height = element.scrollHeight + "px";
    },
    btnClick(){
      // 點擊變紅色與回復原狀
      this.expand_message = !this.expand_message;
    },

    handleInput (e) {
      //e.preventDefault()

      console.log("E " + e.key)
      console.log("xxx " + e.target.style.height)
      if (e.key === "Enter") {
        console.log("Offset")
        e.preventDefault()
        //document.setAttribute('style','');
        this.onSubmit();
        //document.getElementById('myInput').style.height = "100px";
        //document.getElementById('myInput').focus()
        document.getElementById('myInput').value = ''

      } else {

        //document.getElementById('myInput').style.height = "100px";
        let element = this.$refs["textarea"];
        element.style.height = 20 + "px";
        element.style.height = element.scrollHeight + "px";
      }

    },
    handleImageChange (e) {
      const images = e.target.files[0];
      if (images) {

        this.files = e.target.files[0];
        this.filename = e.target.files[0].name;
        console.log("File name " + this.files.name)
        //this.msg = images.name;
        //this.blob = new Blob([images], {type: "file"})
        this.blob = URL.createObjectURL(images);
      }
    },
    async onSubmit() {
      const now = new Date();
      const reader = new FileReader();


      if (this.files) {
        console.log("Files before - " + this.files.name)

        const data = new FormData();
        data.append('file', this.files, this.files.name)

        // const createdChatImage = await imageService.createChatImage(data);
        const createdChatImage = await awsUploadService.uploadChatImage(data);

        console.log("Image key _ " + createdChatImage.key);
        console.log("Chat image id " + createdChatImage.id);
        reader.onload = (e) => {
          const bytes = new Uint8Array(e.target.result);
          console.log("Files " + this.files)
          this.$emit("new:message", {msg_status: "file", body: this.msg}, this.blob, dateFormat(now, 'dd-mm-yyyy,  HH:MM'),);
          socket.emit("private server message", {
            content: {msg_status: "file", body: this.msg},
            img: bytes,
            //file: this.filename,
            imgID: createdChatImage.id,
            key: createdChatImage.key,
            file: createdChatImage.imageUrl,
            date: dateFormat(now, 'dd-mm-yyyy,  HH:MM'),
            to: this.user.userID,
          });

          this.msg = "";
        };
        reader.readAsArrayBuffer(this.files);

        this.files = null;
      } else {
        const content = {
          msg_status: "text",
          body: this.msg
        }
        this.$emit("new:message", content, this.blob, dateFormat(now, 'dd-mm-yyyy,  HH:MM'),);
        socket.emit("private server message", {
          content: {msg_status: "text", body: this.msg},
          img: null,
          file: null,
          date: dateFormat(now, 'dd-mm-yyyy,  HH:MM'),
          to: this.user.userID,
        });
        this.msg = ""
      }

      //this.files = null;


      // if (this.files) {
      //   const sendingImage = {
      //     type: "file",
      //     body: this.files.name,
      //   }
      //   this.$emit("new:message", sendingImage, dateFormat(now, 'dd-mm-yyyy,  HH:MM'),);
      //   this.image = null;
      //   this.msg = "";
      // } else {
      //   const sendingText = {
      //     type: "text",
      //     body: this.msg
      //   }
      //   this.$emit("new:message", sendingText, dateFormat(now, 'dd-mm-yyyy,  HH:MM'),);
      //   this.msg = "";
      // }


    },
    zoomChatImage (image) {
      console.log("Zooming chat image!")
      this.imageToZoom = image;
      this.isImageZoom = true;
    },
    displaySender(message, index) {
      return (
          index === 0 ||
          this.user.messages[index - 1].fromSelf !==
          this.user.messages[index].fromSelf
      );
    },
    async scrollToEnd() {
      try {
        if (this.messages && this.messages.length > 0) {
          console.log(" Is in end ------------ " + this.messages.length)
          const id = await this.messages[this.messages.length-1].id;
          document.getElementById(id).scrollIntoView({ block: "start" });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    isValid() {
      return this.msg.length > 0;
    },
  },



};
</script>

<style scoped>
input[type="file"] {
  display: none;
}
.custom-image-upload {
  width: 50px;

  color: white;
  font-size: 18px;
  background-color: #292424;
  border: 1px solid #999494;
  display: inline-block;
  padding: 20px 12px;
  margin-bottom: 0;
  cursor: pointer;
}

.sender-btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.paper {
  /*width: 80vw;*/

  width: 100%;
  /*height: 80vh;*/
  /*border: solid red;*/
  /*max-width: 500px;*/
  max-height: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;

}
.container {
  /*width: 100vw;*/
  /*height: 100vh;*/

  border: solid red;
  width: 100%;
  height: 400px;
  display: flex;
  /*align-items: center;*/


  justify-content: center;
}
.messagesBody {
  width: calc( 100% - 10px );
  margin: 10px;
  /*overflow-y: hidden;*/
  /*background-color: #423f3f;*/
  height: calc( 100% - 80px );



}

.messageBody:hover {
  overflow-y: hidden;
}

.messageRow {
  display: flex;
}
.messageRowRight {
  display: flex;
  justify-content: flex-end;

}
.messageBlue {
  position: relative;
  /*margin-left: 20px;*/
  margin-bottom: 10px;
  padding: 20px;
  background-color: #437b9e;
  color: white;

  width: 200px;

  text-align: left;
  font: 400 .9em 'Open Sans', sans-serif;
  font-size: 17px;
  border: 1px solid #3d6b88;
  /*border-radius: 10px;*/
  border-radius: 0 1.125rem 1.125rem 1.125rem;

}
.messageOrange {
  position: relative;
  /*margin-right: 20px;*/
  margin-bottom: 10px;
  padding: 20px;
  background-color: #7b694a;
  color: white;
  width: 200px;

  text-align: left;
  font: 400 .9em 'Open Sans', sans-serif;
  font-size: 17px;
  border: 1px solid #8b7718;
  /*border-radius: 10px;*/
  border-radius: 1.125rem 1.125rem 0 1.125rem;


}

.messageContent {
  padding: 0;
  margin: 0;

}
.messageTimeStampRight {
  position: absolute;
  color: #a0dde0;
  font-size: .85em;
  font-weight: 400;
  margin-top: 10px;
  bottom: -3px;
  padding: 5px;
  right: 5px;

}

.displayName {
  /*margin-left: 20px;*/
  font-weight: bold;
  text-align: left;
}

.sender {
  font-weight: bold;
  border: none;

  background-color: #292424;

  border-top: 1px solid #999;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;

}
.date {
  color: blue;
}

/*.form {*/
/*  padding: 10px;*/
/*}*/

/*.input {*/
/*  width: 80%;*/
/*  resize: none;*/
/*  padding: 10px;*/
/*  line-height: 1.5;*/
/*  border-radius: 5px;*/
/*  border: 1px solid #000;*/
/*}*/

/*.send-button {*/
/*  vertical-align: top;*/
/*}*/



.chat-panel {
  /*margin-top: 50px;*/
  height: 400px;
  background: linear-gradient(
      90deg,
      rgba(188, 255, 147, 1) 0%,
      rgba(88, 245, 158, 1) 53%,
      rgba(0, 237, 69, 1) 100%
  );

}
.chat-panel:hover {
  overflow-y: hidden;
}
.panel {

  /*display: flex;*/
  /*flex-direction: column;*/
  /*position: relative;*/

  padding: 10px;
  /*margin: 0 auto;*/
  /*max-width: 300px;*/
  width: 100%;
  height: 400px;
  margin-bottom: 15px;

  /*height: 500px;*/


  /*
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  */
  background-color: #423f3f;
  border-radius: 10px;
  /*border: 1px solid #5f5a5a;*/


}
.messages {
  /*text-align: left;*/
  height: 370px;
  width: 100%;
  overflow-y: auto;
  scrollbar-face-color: red;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  /*background-color: white;*/
  background-color: #423f3f;
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
  margin-top: 10px;
  display: flex;
}

.text {
  /*width: 50%;*/
  background-color: #6e716e;
  color: #ddd;
  display: inline-flex;
  margin-top: 5px;
  text-align: left;
  flex-direction: column;
  /*justify-content: flex-end;*/

  border-radius: 10%;
  padding: 0.8rem;
  overflow-wrap: break-word;

}
.myText {
  background-color: #6e716e;
  color: red;
}

input {
  width: 93%;
  border: none;
  height: 20px;
  padding: 20px;
  border-top: 1px solid #999;
  border-radius: 0;
  outline: none;
}
.input-field {
  width: 93%;
  border: none;
  height: 20px;
  padding: 20px;
  border-top: 1px solid #999;

  border-radius: 0;
  outline: none;
}
/*textarea {*/
/*  width: 100%;*/
/*  overflow-y: hidden;*/
/*  border:none;*/
/*  outline: none;*/
/*  border-top: 1px solid #999;*/
/*}*/

button {
  border: none;
  /*border: 2px solid #999;*/

  padding-left: 10px;
  outline: none;
  background: none;

  right: 3px;
  top: 4px;
  font-size: 24px;
}
button:hover {
  cursor: pointer;
  color: green;
}


/*8px*/
textarea {
  width: 97%;
  min-height: 80px;
  border: none;
  padding: 20px;
  resize: none;
  overflow: hidden;
  background-color: transparent;
  border-bottom: 1px solid#999;
  border-left: 1px solid #999;
  border-top: 1px solid #999;
  /*border: 2px solid #999;*/
  /*border-radius: 4px;*/
  font-size: 1.5rem;
  color: #000;
}
.chatImageZoomedContainer {
  width: 100%;
  border: 1px solid darkgrey;
  margin-bottom: 20px;

}
.chatImageZoomed {
  width: 100%;
}
textarea:focus {
  outline: none;
  }

/*html {*/
/*  overflow: scroll;*/
/*  overflow-x: hidden;*/
/*}*/

::-webkit-scrollbar {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #FF0000;
}
</style>
