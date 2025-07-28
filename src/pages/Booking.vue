<template>
  <div v-if="!distance" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <div v-else>
    <div v-if="booking.isIncludeOffers">
      <div v-if="isDisableProNotOfferBtns" style="background-color: dimgrey;">
        <p style="color: #ddd; display: flex; justify-content: right; padding: 7px; cursor: pointer;" @click="offerAbortAccepted"><strong>Selvä</strong></p>
        <p style="color: darkorange; padding: 7px;">Order with offer is aborted by client!</p>
      </div>
    </div>

    <div v-else>
      <div v-if="isDisableProNotMapBtns" style="background-color: dimgrey;">
        <p style="color: #ddd; display: flex; justify-content: right; padding: 7px; cursor: pointer;" @click="offerAbortMapAccepted"><strong>Selvä</strong></p>
        <p style="color: darkorange; padding: 7px;">Order from map is aborted by client!</p>
      </div>
    </div>


    <MDBTable  borderless style="font-size: 14px; color: #dddddd; text-align: left;">
      <tbody>
      <tr>
        <td>

          <MDBBtnClose
              white
              class="closeData"
              @click="closeBooking"
          />
          {{booking.address}}
        </td>
      </tr>
      <tr>
        <td>
          Distance: {{ distance }} km.
        </td>
      </tr>
      <tr>
        <td>
          Driving duration: {{duration}}.
        </td>
      </tr>
      <tr>
        <td style="border: solid darkslategrey;">
          {{booking.description}}
        </td>
      </tr>
      <tr>
        <td>
          <date-format :date = "new Date(booking.created)"/>
        </td>
      </tr>
      <tr >

        <td v-if="booking.image && booking.image.length > 0">
          <MDBBtn

              outline="success"
              @click="openImagePanel(booking.image)"
          >
            {{!isImageOpen ? "Avaa kuvat tehtävästä!" : "Sulje kuvat tehtävästä!"}}

          </MDBBtn>


          <div >


            <MDBRow v-if="isImageOpen">
              <MDBCol v-for="image in booking.image" :key="image._id">

                <div style="margin-top: 17px;">
                  <img  style="width: 200px;" :src="image.show ? image.show : image.imageUrl" alt="client-image"/>
                </div>


              </MDBCol>
            </MDBRow>

            <div >

            </div>

          </div>


        </td>
      </tr>

      <tr>
        <td>

          <MDBBtn v-if="booking.isIncludeOffers" outline="info" @click="pressOpenChat(provider, booking)" size="lg" style="float: right;" :disabled="isDisableProNotOfferBtns">
            {{!isOpenChat ? 'Avaa' : 'Sulje'}}&nbsp;&nbsp;
            <MDBIcon>
              <i class="far fa-comments"></i>
            </MDBIcon>
          </MDBBtn>

          <MDBBtn v-else outline="info" @click="pressOpenChat(provider, booking)" size="lg" style="float: right;" :disabled="isDisableProNotMapBtns">
            {{!isOpenChat ? 'Avaa' : 'Sulje'}}&nbsp;&nbsp;
            <MDBIcon>
              <i class="far fa-comments"></i>
            </MDBIcon>
          </MDBBtn>


        </td>


      </tr>
      </tbody>
    </MDBTable>
    <!--  createOffer(booking)-->
    <live-chat
        style="margin-bottom: 25px;"
        v-if="isOpenChat"
        :chatusers = chatusers
        :messages =messages
        @select:user = selectUser
        @noSelected = noSelected
        :selecteduser = selecteduser
        @on:message = onMessage
    />
    <div v-if="booking.isIncludeOffers" style="margin-bottom: 20px;">
      <div v-if="!booking.offers.some(offer => offer.provider.id === provider.id)">
        <MDBBtn
            :disabled="isDisableProNotOfferBtns"
            block
            outline="primary"
            size="lg"
            @click="makeOfferBtn(booking)"
        >
          Tee Hintatarjous
        </MDBBtn>

        <div v-if="isOffer" style="padding: 13px; margin-top: 13px; font-size: 14px; border: 1px solid blue; margin-bottom: 20px;">
          <div style="display: flex; justify-content: right; margin-bottom: 7px;">
            <MDBBtnClose white @click="isOffer = false"/>
          </div>

          <MDBInput white type="number" label="Tarjoa hintasi" v-model="priceOffer" wrapperClass="mb-4" />
          <div style="text-align: left; margin-bottom: 10px;">
            <MDBRadio
                label="Tarjoan palvelu asiakkaan luona"
                name="area"
                v-model="place"
                value="go"
            >

            </MDBRadio>
            <MDBRadio
                label="Tarjoan palvelua paikalla"
                name="area"
                v-model="place"
                value="here"
            >

            </MDBRadio>
          </div>


          <MDBTextarea
              white
              style=""
              label="Anna tarvittaessa lisäselvityksiä..."

              rows="3"
              v-model="aboutOffer"
          >

          </MDBTextarea>
          <MDBBtn
              :disabled="isDisableProNotOfferBtns"
              v-if="priceOffer"
              label="Anna hintatarjous"
              block size="lg"
              outline="success"
              style="margin-top: 12px;"
              @click="createOffer(booking)"
          >
            Lähetä
          </MDBBtn>

        </div>
        <MDBBtn :disabled="isDisableProNotOfferBtns" block outline="danger" @click="rejectFormBooking(booking)" size="lg">Poista tilaus</MDBBtn>
      </div>
    </div>

    <div v-else style="margin-bottom: 20px;">
      <!--    <MDBBtn outline="success" block size="lg" @click="isQuitClientBooking = true">Varmista tilaus</MDBBtn>-->

      <MDBBtn
          v-if="!isQuitClientBooking"
          :disabled="isDisableProNotMapBtns"
          block
          outline="success"
          size="lg"
          @click="confirmBooking(booking)"
      >
        Varmista tilaus
      </MDBBtn>

      <div v-if="isQuitClientBooking" style="padding: 13px; margin-top: 13px; border: 1px solid blue;">
        <div style="display: flex; justify-content: right; margin-bottom: 7px;">
          <MDBBtnClose white @click="isQuitClientBooking = false"/>
        </div>

        <MDBTextarea
            white
            style=""
            label="Anna syy..."
            rows="3"
            v-model="reason"
        >

        </MDBTextarea>
        <MDBBtn
            v-if="reason.length > 1"
            :disabled="isDisableProNotMapBtns"
            block size="lg"
            outline="success"
            style="margin-top: 12px;"
            @click="confirmRejectBookingNoOffers(booking)"
        >
          Varmista
        </MDBBtn>
      </div>

      <MDBBtn
          v-if="!isQuitClientBooking"
          :disabled="isDisableProNotMapBtns"
          block
          outline="danger"
          size="lg"
          @click="isQuitClientBooking = true"
      >
        Poista tilaus
      </MDBBtn>

    </div>


    <div>


    </div>


  </div>



</template>

<script>
/* eslint-disable */
// var messageBody = document.querySelector('#bookingPage');

import {
  // MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtnClose,
  MDBTable,
  MDBBtn,
  MDBTextarea,
  MDBInput,
  MDBRadio,
  MDBIcon
} from "mdb-vue-ui-kit";
import {ref} from 'vue'
import LiveChat from "@/pages/LiveChat";
import Gallery from '@/pages/Gallery.vue'
import socket from "@/socket";
import  recipientService from '../service/recipients'
import monthConverter from '../components/controllers/month-converter'
import dateFormat from '../components/controllers/formatDate'
import dist_dur from '../components/controllers/distance'


//import socket from "@/socket";
export default {
  name: "Booking",
  props: {
    booking: Object,
    provider: Object,
    bookingImages: Array,
    selected_room: String,
    selecteduser: null,
    chatusers: Array,
    messages: Array,
    isDisableProNotOfferBtns: Boolean,
    isDisableProNotMapBtns: Boolean
  },
  components: {
    monthConverter,
    dateFormat,
    dist_dur,

    LiveChat,
    Gallery,
    MDBTable,
    MDBBtn,
    MDBBtnClose,
    MDBTextarea,
    MDBInput,
    MDBRadio,
    MDBIcon,
    MDBRow,
    MDBCol
  },
  data () {
    const place = ref('here')
    return {

      distance: null,
      duration: null,

      isOffer: false,
      priceOffer: null,
      aboutOffer: null,
      isOpenImage: false,
      isImageOpen: false,
      srcImg: "",
      reason: "",
      place,
      isOpenChat: false,
      isQuitClientBooking: false
    }
  },
  mounted () {
    if (window.google) {
      //this.calculateDistDur();
    }
    this.calculateDistDur();
    console.log("Y " + this.provider.yritys)
    //messageBody.scrollIntoView();

  },
  methods: {
    offerAbortAccepted () {
      this.$emit("confirmOfferAbort");
    },
    offerAbortMapAccepted () {
      this.$emit("confirmMapOfferAbort");
    },
    calculateDistDur () {
      const latLng_1 = [
        this.booking.latitude, this.booking.longitude
      ];
      const latLng_2 = [
          this.provider.latitude, this.provider.longitude
      ]
      //console.log("CXC " + dist_dur.findDistance([60.276451557679316, 24.858190796621688], [60.29733169999999, 25.0449442]));

      try {
        console.log("CXC " + dist_dur.findDistance(latLng_1, latLng_2));
        dist_dur.findDistance(latLng_1, latLng_2)
            .then(d => {
              console.log("Distance is " + d.distance);
              this.distance = d.distance;
              this.duration = d.duration;
            })
      } catch (err) {
        console.log("Tapahtui error")
      }

    },
    async initChatPanel (provider, booking) {
      console.log("Booking id - " + booking.id)
      console.log("Booking user name " + booking.user.username);

      const createChatRoom = {
        isActive: true,
        bookingID: this.booking.id,
        same_room_counter: 1,
        isOnline: false,
        room: this.selected_room,
        pro: provider.yritys,
        status: "form",
        bookerUsername: booking.user.username,
        bookerID: booking.user.id,
        providerUsername: provider.user.username,
        providerID: provider.user.id
      }
      const chatCredentials = {
        isActive: true,
        bookingID: this.booking.id,
        same_room_counter: 1,
        room: this.selected_room,
        proID: provider.user.id,
        pro: provider.yritys,
        userID: provider.user.id,
        username: provider.user.username
      }

      this.$emit("initializeChat", createChatRoom, chatCredentials);

    },
    pressOpenChat (provider, booking) {

      console.log("Pro --- " + provider.user.username)
      console.log("Booking " + booking.user.username)
      //this.initChatPanel(provider, booking)
      this.$emit("openChatPanel");

      //this.$emit("set:room", this.selected_room);
      // console.log("Selected room - " + this.selected_room)
      //socket.emit("update room", this.selected_room)
      this.isOpenChat = !this.isOpenChat;

    },
    getBooking (booking) {
      console.log("Booking user " + booking.booking.id)
    },

    selectUser(user) {
      this.$emit("select:user", user)
    },
    noSelected () {
      this.$emit("noSelected");
    },
    onMessage (content, date) {
      this.$emit("on:message", content, date);
    },
    openImagePanel (image) {
      this.isOpenImage = true;
      this.isImageOpen = !this.isImageOpen;
      // this.srcImg = require(`/server/uploads/${image.map(im => im.name)}`)
      // if (this.srcImg !== '') {
      //   this.isImageOpen = true;
      // }

    },
    closeImagePanel () {
      this.isOpenImage = false;
      this.isImageOpen = false;
    },

    makeOfferBtn (booking) {
      this.isOffer = true
      this.$emit("init_offer", booking);
    },

    async createOffer (booking) {
      const currentBooking = await recipientService.getBookingById(booking.id);
      console.log("Test: Booking zone:: " + booking.zone);
      //console.log("Creating offer id xx " + bookingToDisplay.user.id)
      this.isOffer = false;
      this.$emit("create:offer", this.priceOffer, this.place, currentBooking.zone, this.aboutOffer, currentBooking);


      //await recipientService.createOffer()
    },
    confirmBooking (booking) {
      console.log("Booking header " + booking.header);
      this.$emit('confirm:booking', booking);

    },
    // Close opened booking
    closeBooking () {
      this.$emit("close:booking")
      this.noSelected();
    },
    rejectFormBooking (booking) {
      if (confirm("Oletko varmaa, että haluat poistaa tilauksen!?") === true) {

        this.isQuitClientBooking = true;
        console.log("Reject")
        this.$emit("rejectFormBooking", booking);

      } else {
        console.log("You canceled!")
      }


    },
    confirmRejectBookingNoOffers (booking) {
      this.$emit("reject_booking_no_offers", booking, this.reason);
      this.noSelected();
    }
  }
}
</script>

<style scoped>

img.loading {
  width: 100%;
  height: 400px;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}
.closeData {
  float: right;
}
.closeData:hover {
  color: red;
}
</style>