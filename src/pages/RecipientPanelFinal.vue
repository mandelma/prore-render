<template>

  <div>
    <!--
    <MDBContainer style="margin-top: 30px;">
    -->
<!--    users {{chatusers}}-->
    <div style="display: flex; justify-content: right; padding: 20px;">
      <MDBBtnClose
          white
          style="cursor: pointer;"
          @click="canselRecipientFinal"
      />
    </div>
    <div class="client-final-header">
      <h2 >- {{ provider.yritys }} -</h2>
      <rating-stars :rating = "provider.rating.positive / provider.rating.count" />
    </div>

    <div style="margin-bottom: 17px;">
      <pro-data
          :proAvatar = "proAvatar"
          :proInfo = provider.description />
    </div>


    <div class="client-final" v-if="!isOpenProImage">
      <MDBTable style="font-size: 14px; color: #dddddd; text-align: left;">
        <tbody>
        <tr>
          <td :class="{hideFeedbackRow: isDisplayFeedbackPanel}">
            {{ t('recipient_final_feedback') + "  &nbsp; ( " + ( provider.feedback.length ) + " )"}}
          </td>
          <td v-if="!isDisplayFeedbackPanel">
            <MDBBtn block outline="info" @click="openFeedbackPanel">Katso saatu arvostelut</MDBBtn>
          </td>
          <td v-else colspan="2">
            <feedback-list
                style=""
                :feedback = provider.feedback
                @closeFeedbackList = handleCloseMainFeedbackList
            />
          </td>
        </tr>
        <tr>
          <td>
            Y-tunnus
          </td>
          <td>
            {{provider.ytunnus}}
          </td>
        </tr>
        <tr>
          <td>
            Osoite:
          </td>
          <td>
            {{provider.address}}
          </td>
        </tr>
        <tr>
          <td>
            Hintatarjous
          </td>
          <td>
            {{offer.price}} euroa,   sis alv
          </td>
        </tr>
        <tr>
          <td>
            Selvitys hitnatarjouksesta
          </td>
          <td>
            {{offer.description}}
          </td>
        </tr>
        <tr v-if="offer.palace === 'go'">
          <td>
            palvelun paikka
          </td>
          <td>
            <p v-if="provider.range === 0">Palvelun osoite: {{provider.address}}</p>
            <p v-else>
              Palvelu tarjotaan ilmoittamassasi osoitteessa.
            </p>
          </td>
        </tr>


        <tr>
          <td>
            palvelun paikka
          </td>
          <td>
            <p v-if="offer.place === 'here'">Palvelun osoite: {{provider.address}}</p>
            <p v-else>
              Palvelu tarjoataan ilmoittamassasi osoitteessa.
            </p>
          </td>
        </tr>
        <tr v-if="provider.pro_link">
          <td>
            Kotisivu
          </td>
          <td>
            <a :href="'//' + provider.pro_link" target="_blank">
              Avaa kotisivu
            </a>
          </td>
        </tr>

        </tbody>
      </MDBTable>

      <MDBBtn
          v-if="proRefSlides.find(slide => slide.pro === provider.id).slides.length > 0"
          style="margin-bottom: 13px;"
          block outline="primary"
          size="lg"
          @click="isPressedOpenGallery = !isPressedOpenGallery"
      >
        {{!isPressedOpenGallery ? "Avaa galleria" : "Sulje galleria"}}
      </MDBBtn>
      <div v-if="isPressedOpenGallery" style="margin-bottom: 30px;">
        <MDBRow v-for="pro_slide in proRefSlides.filter(slide => slide.pro === provider.id)" :key="pro_slide._id">

          <MDBCol v-for="(image, i) in pro_slide.slides" :key="i">
            <img
                style="width: 300px; margin-top: 13px; cursor: pointer;"
                @click="openProImage(i, {img: image.show ? image.show: image.imageUrl})"
                class="loading"
                :src="image.show ? image.show: image.imageUrl"
                alt='reference'
            />

          </MDBCol>
        </MDBRow>
      </div>
    </div>
    <div v-else style="border: 1px solid cadetblue; margin-bottom: 15px;">
      <div style="display: flex; justify-content: right;">
        <h3 style="color: green; cursor: pointer; padding: 15px;" @click="isOpenProImage = false">Valmis</h3>
      </div>
      <img class="load-zoom" :src="zoomedImage" alt="image_zoom" />
    </div>



    <MDBBtn
        v-if="!isChat"
        style="margin-top: 13px; float: right;"

        outline="warning"
        size="lg"
        @click="createJoinChatPanel"
    >
      &emsp;
      <i class="far fa-comments" style="font-size: 24px;"></i>
    </MDBBtn>
    <div v-else>

      <h3 style="color: green; float: right; cursor: pointer" @click="isChat = false">Valmis</h3>
    </div><br>


    <live-chat
        v-if="isChat"
        :test = test
        :chatusers = chatusers
        :messages =messages
        :selecteduser = selecteduser
        @select:user = selectUser
        @noSelected = noSelectUser
        @on:message = onMessage

    />

<!--    <MDBBtn block color="primary" size="lg" @click="handleRecipientAction(provider.id)">Testime saadavust...</MDBBtn>-->


    <MDBBtn style="margin-top: 20px;" outline="info" block size="lg" @click="handleOrder(provider)">
      Tilaa yritys
    </MDBBtn>

<!--    Provider {{provider}}<br>-->
<!--    Pro avatar {{proAvatar}}-->

<!--    Slides {{proSlides}}-->
<!--    proRefSlides {{proRefSlides}}-->

  </div>
<!--  selecteduser {{selecteduser}}-->
</template>

<script>
/* eslint-disable */
import {
  MDBBtn,
  //MDBContainer,
  MDBTable,
  MDBRow,
  MDBCol,
  MDBIcon, MDBBadge, MDBBtnClose
}from "mdb-vue-ui-kit";
import PositiveFeedback from "@/components/PositiveFeedback";
import NegativeFeedback from "@/components/NegativeFeedback"
import liveChat from '../pages/LiveChat'
import feedbackList from "@/components/FeedbackList";


import socket from "@/socket";
import User from '../components/chatio/User'
import MessagePanel from '../components/chatio/MessagePanel.vue'
import { useI18n } from 'vue-i18n';
import Gallery from '@/pages/Gallery.vue'
import ProData from "@/components/ProData";
import ratingStars from "@/components/RatingStars";

export default {
  name: "recipient-final",
  props: {
    test: Boolean,
    chatusers: Array,
    chatCredentials: Object,
    offer: Object,
    selecteduser: null,
    messages: Array,
    provider: Object,
    proRefSlides: Array,

    isPro: false,
    proSlides: Array,
    room: String,
    roomUserCount: Number,
    available: String,
    booking: Array
  },
  components: {
    ProData,
    ratingStars,
    User,
    MessagePanel,
    feedbackList,
    //UserDialog,
    //DialogPanel,
    PositiveFeedback,
    NegativeFeedback,
    Gallery,
    liveChat,
    MDBBtn,
    //MDBContainer,
    MDBTable,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBadge,
    MDBBtnClose
  },
  data() {
    const { t } = useI18n();
    return {
      t,
      proAvatar: this.provider.user.avatar.isImage === true ? this.provider.user.avatar.imageUrl : null,
      selectedUser: null,
      isPositive: false,
      isNegative: false,

      isChat: false,
      isPressedOpenChat: false,
      isPressedOpenGallery: false,
      isPressedContactToUser: false,
      isConnection: false,
      isTwoUsers: false,

      isDisplayFeedbackPanel: false,
      feedback: this.provider.feedback,

      slides: [],
      isOpenProImage: false,
      zoomedImage: "",
      //room: "",

      isPressedFinal: false,

      //isRoom: false,
      count: 0,
      userCount: 0
    }
  },
  mounted () {
    this.slides = this.proRefSlides.filter(slide => slide.id === this.provider.id);
  },
  methods: {
    openFeedbackPanel () {
      this.isDisplayFeedbackPanel = true;
    },
    handleCloseMainFeedbackList () {
      this.isDisplayFeedbackPanel = false;
    },
    openProImage (index, fill) {
      this.zoomedImage = fill.img;
      this.isOpenProImage = true;
    },
    // handleAction () {
    //   const id = this.provider.user.id;
    //   console.log("Sended to user id... " + id)
    //   socket.emit("accept provider", {
    //     id,
    //     //to: this.loggedUser.id,
    //   })
    // },


    // chatCredentials (data) {
    //   this.$emit("chatCredentials", data);
    // },

    createChatPanel () {
      // this.isChat = true;
      // this.$emit("initializeChat");
    },

    createJoinChatPanel () {
      console.log("Pressed")
      this.$emit("join_chat_panel")

      this.isChat = true;
    },

    selectUser(user) {
      this.$emit("select", user)
      //if (!user.self)
      //this.selectedUser = user;
    },

    noSelectUser () {
      this.$emit("noSelect");
    },

    onMessage(content, date) {

      this.$emit("message", content, date)

    },




    test (state) {
      console.log("From chat: " + state)
    },

    // openChat () {
    //   this.isChat = true;
    //   this.count++;
    //
    //   //this.isChat = true;
    //
    //   console.log("this room is " + this.room)
    // },

    // Uus teema homseks valmis aretada!!!

    // contactToUser() {
    //
    //   this.isPressedContactToUser = true;
    //   socket.emit('updateRoom', this.room);
    //   socket.on('get updated room users', (data) => {
    //     console.log("New users update " + data.users.length)
    //     if (data.users.length > 1) {
    //       this.isConnection = true;
    //       //this.isTwoUsers = true;
    //     } else {
    //       this.isConnection = false;
    //     }
    //
    //   })
    //   this.isPressedFinal = true;
    //   this.isChat = true;
    // },


    handleOrder (provider) {
      this.$emit('provider:ordered', provider)

    },
    getPositiveFeedback () {
      this.isPositive = true;
      this.isNegative = false;

    },
    getNegativeFeedback () {
      this.isNegative = true;
      this.isPositive = false;
      //console.log("Feedback")
    },
    closeComments (result) {
      this.isPositive = this.isNegative = result;
      console.log("result " + result)
    },
    canselRecipientFinal () {
      this.isChat = false;

      this.$emit('cansel:final', false)
      this.noSelectUser();

    }
  },

}
</script>

<style>
@media (max-width: 570px) {
  .hideFeedbackRow {
    display: none !important;
  }
}

img.loading {
  width: 100%;
  height: 100%;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}
img.load-zoom {
  width: 100%;
  height: 100%;
}
</style>