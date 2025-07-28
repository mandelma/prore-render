<template>
  <div>

    <MDBContainer style="margin-top: 50px">

      <div v-if="isBooking">
        <recipientResult
            :test = test
            :booking = booking
            :images = images
            :proRefSlides = proRefSlides
            :bookingTime = recipientDateTime
            :booking_offers = booking.offers
            :providers = providerMatchByProfession
            :confirmedBookings = confirmedBookings
            :line = line
            @updateBookingDate = handleUpdateBookingDate
            @set:order:to:send = handleOrderToSend
            @editBookingOfferStatus = handleEditBookingOfferStatus
            @client:confirmed_provider = handleClientConfirmedProvider
            @removeOfferedBooking = handleRemoveOfferedBookings
            @cansel:result = handleCanselResult

            @editDescription = handleEditDescription

            @addImage = handleAddImage
            @editImage = handleEditImage
            @removeImage = handleRemoveImage

            @finalinfo = finalinfo
            :chatusers = chatusers
            :selecteduser = selecteduser
            :messages = messages
            @select = selectUser
            @noSelect = noSelectUser
            @message = onMessage
            @initializeChat = handleInitializeChat
            @joinChatPanel = handleJoinChatPanel
            @filter_provider = handleFilterProvider

            @offer_confirmed = handleOfferedBookingConfirmed

            @otherUser = otherUser
        />
      </div>
      <div v-else>

        <div v-if="isSpinner" class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else>

          <MDBRow>

            <MDBCol md="8">

              <div v-if="confirmedBookingsByProvider.length > 0"  class="scalein animation-duration-3000 animation-iteration flex align-items-center justify-content-center
                          font-bold   w-full ">
                <p @click="$router.push('/calendar')">Katso vahvistetut tilaukset kalenterista!</p>

              </div>
            </MDBCol>
            <MDBCol style="padding: 20px 5px 20px 5px; color: cadetblue" md="4">
              <h3 class="client-header">{{t('recipient_panel_you_have') + " " + recipientBookings.length + " " + t('recipient_panel_open_orders')}} </h3>
            </MDBCol>
          </MDBRow>

          <!--          v-if="confirmedBookingsByClient.some(ccb => ccb.id === booking.id)"-->
          <MDBRow v-for="(booking, index) in recipientBookings" :key="index" class="bookings">
            <div class="client-orders">
              <aside  id="info-block-confirmed" >
                <section class="file-marker">
                  <div>
                    <div class="box-title-confirmed">
                      {{!booking.isIncludeOffers ? t('recipient_panel_order_is_pending') : (booking.offers.length > 0 ? booking.offers.length + " " + t('offerCountNotification') : t('recipient_panel_no_offers'))}}
                    </div>
                    <div class="box-contents-confirmed">

                      <MDBRow>
                        <MDBCol>
                          {{booking.date}}

                          <p class="booking_time">
                            klo
                            {{new Date(booking.created).getHours() >= 10 ? new Date(booking.created).getHours() : "0" + new Date(booking.created).getHours() }} :
                            {{new Date(booking.created).getMinutes() >= 10 ? new Date(booking.created).getMinutes() : "0" + new Date(booking.created).getMinutes() }}
                          </p>
                        </MDBCol>
                        <MDBCol>
                          {{booking.header}}
                        </MDBCol>

                        <MDBCol lg="4">
                          <div v-if="!booking.isIncludeOffers">
                            <MDBBtn
                                v-if="index === selectedIndex"
                                style="margin-bottom: 13px;"
                                outline="danger" block size="lg"
                                @click="canselQuitSelectedBooking"
                            >
                              Poistu
                            </MDBBtn>
                            <MDBBtn v-else color="danger" @click="handleQuitSelectedBooking(index)" >{{t('recipient_panel_quit_order')}}</MDBBtn>
                          </div>

                          <MDBBtn v-else  outline="success" size="lg" @click="handleRecipientResult(booking.id, booking)" style="width: 100%;">
                            <span :class="{date_expired: booking.created_ms - new Date().getTime() <= 0}" >{{t('recipient_panel_order')}}</span>
                            <MDBBadge v-if="booking.offers.filter(offer => offer.isNewOffer).length > 0" color="danger"  class="ms-2" >
                              {{booking.offers.filter(offer => offer.isNewOffer).length}}
                            </MDBBadge>
                          </MDBBtn>

                        </MDBCol>
                      </MDBRow>
                      <MDBRow v-if="selectedIndex === index && !booking.isIncludeOffers">

                        <MDBCol lg="8" style="text-align: center;">
                          <MDBTextarea
                              v-if="isQuitBooking"
                              white
                              style=""
                              v-model="clientQuitBookingReason"
                              :label="t('recipient_panel_give_reason')"
                              rows="3"
                          >

                          </MDBTextarea>

                        </MDBCol>
                        <MDBCol lg="4">
                          <MDBBtn v-if="isQuitBooking && clientQuitBookingReason.length > 3" block color="success" size="lg>" style="margin-top: 10px;" @click="clientRejectBookingNoOffers(booking)">{{t('recipient_panel_confirm_quit')}}</MDBBtn>
                        </MDBCol>

                      </MDBRow>

                    </div>
                  </div>
                </section>
              </aside>

            </div>


          </MDBRow>
          <div style="margin-top: 23px;">
            <MDBBtn outline="info" block size="lg" @click="newBooking">{{t('recipient_panel_new_order')}}</MDBBtn>
          </div>



        </div>

      </div>

      <!--      &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;offers {{offers}}<br>-->
      <!--      BOOKING OFFERS {{booking}}-->
      <!--      Booking {{booking}}-->

      <!--      RECIPIENTBOOKINGS {{recipientBookings}}<br>-->
      <!--      CLIENTCONFIRMEDB {{clientConfirmedBookings.length}}<br>-->

      <!--      ++confirmedBookingsByProvider+++ {{confirmedBookingsByProvider}}-->

      <!--      client confirmed bookings {{confirmedBookingsByClient}}-->
    </MDBContainer>

    <!--    images RP {{images}}<br>-->
    <!--    &#45;&#45;&#45;&#45;&#45;&#45;resipient bookings {{recipientBookings}}-->
    <!--    pro ref slides PANEL {{proRefSlides}}-->

  </div>
</template>

<script>


import {
  //MDBTable,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTextarea,
    MDBBadge
}from "mdb-vue-ui-kit";
import '@/css/style.css';
import '@/css/notification.css'
import {ref} from "vue";
import liveChat from './LiveChat'
import providerFit from '../components/controllers/datetime'
import { useI18n } from 'vue-i18n';
/* eslint-disable */
//import dist from '../components/controllers/distance'
//import validateToken from "@/components/validateToken";
//import Fieldset from 'primevue/fieldset';

//import RecipientSuccess from '../components/RecipientSuccess'
import recipientResult from '../pages/RecipientPanelResult'
import providerService from '../service/providers'
import recipientService from '../service/recipients'
import offerService from '../service/offers'
import bookingInfo from '../components/CompletedBookingPanel'
//import RecipientBookingChatPanel from './RecipientBookingChatPanel'
//import axios from "axios";
//import driving from '../components/controllers/distance'

import monthConverter from '../components/controllers/month-converter'
import socket from "@/socket";
//import axios from "axios";
export default {
  name: "recipient-panel",
  props: {
    test: Boolean,
    chatusers: Array,

    selecteduser: null,
    messages: Array,
    proRefSlides: Array,
    recipientTest: null,
    recipientBookings: Array, // bookings from app

    confirmedBookingsByClient: Array,
    confirmedBookingsByProvider: Array,

  },
  data () {
    const { t } = useI18n();
    return {
      t,
      id: "",
      isSpinner: false,
      images: [],
      userId: null,
      //bookings: [],
      //recipientBookings: [],
      bookings: this.recipientBookings,
      provider: {},
      booking: null,
      offers: [],
      isQuitBooking: false,
      currentRoom: "",
      selectedIndex: null,
      isPressedQuit: false,
      clientQuitBookingReason: "",
      d: null,
      //confirmedBookings: [],
      confirmedBookings: [] ,
      //confirmedBookings: this.recipientBookings.filter(booking => booking.status === "confirmed"),
      clientConfirmedBookings: [],
      //clientConfirmedBookings: this.recipientBookings.filter(cb => cb.status === "notSeen" || cb.status === "seen"),
      isBooking: false,
      //providerMatchByProfession: null,
      providerMatchByProfession: [],
      providerMatchingRequirements: null,
      line: "",
      recipientDateTime: null,
      providersAvailable: [],
      providersBusy: []
    }
  },
  setup () {
    const isAvailable = ref(false)
    return {
      isAvailable
    }
  },
  components: {
    //RecipientSuccess,
    //Fieldset,
    //validateToken,
    //RecipientBookingChatPanel,
    liveChat,
    bookingInfo,
    recipientResult,
    //MDBTable,
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBTextarea,
    MDBBadge
  },
  async mounted () {

    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (!loggedUserJSON) {
      this.$router.push('/')
    } else {
      const user = JSON.parse(loggedUserJSON)
      this.userId = user.id

      this.provider = await providerService.getProvider(user.id);

      await this.handleRecipientBookings();

    }

  },
  methods: {
    handleJoinChatPanel (room) {
      console.log("Join chat room " + room);
      this.$emit("joinChatPanel", room);
    },
    handleOfferedBookingConfirmed (booking, proID) {
      this.$emit("offer_confirmed", booking, proID);
    },

    async handleEditBookingOfferStatus (offer) {
      console.log("Editing offer status id: " + offer.id);
      await offerService.editStatus(offer.id, {isNewOffer: false});
      //this.offers = this.offers.filter(offer => offer.id !== offer.id);
      this.offers.map(item => item.id === offer.id ? item.isNewOffer = false : item);
      this.$emit("editOfferStatus", offer.id);
    },

    async clientRejectBookingNoOffers (booking) {
      this.selectedIndex = null;

      if (confirm("Oletko varmaa, että haluat poista tilauksen?")) {
        const rejectedBooking = await recipientService.getBookingById(booking.id)
        const room = rejectedBooking.ordered[0].yritys + rejectedBooking.user.username;

        await this.$emit("reject_bookingByClient_no_offers", rejectedBooking, rejectedBooking.ordered[0].id, room)
        console.log("Rejected booking user id.. " + rejectedBooking.ordered[0].user.id);
        socket.emit("reject map booking by client", {
          id: rejectedBooking.ordered[0].user.id,
          room: room,
          booking: rejectedBooking,
          reason: this.clientQuitBookingReason
        })
        this.clientQuitBookingReason = "";
        this.isQuitBooking = false;
      }
    },
    handleUpdateBookingDate (booking, nd) {
      this.recipientDateTime = new Date(nd.year, nd.month, nd.day, nd.hours, nd.minutes);
      const created = new Date(nd.year, nd.month, nd.day, nd.hours, nd.minutes);
      const date = (nd.month + 1) + "/" + nd.day + "/" + nd.year;
      this.$emit("recipient:date_ms", booking, date, created,  new Date(nd.year, nd.month, nd.day, nd.hours, nd.minutes).getTime())
      console.log("recipient date time " + this.recipientDateTime);

    },
    handleQuitSelectedBooking (index) {
      this.selectedIndex = index;
      console.log("Index " + index)
      console.log("Selected index " + this.selectedIndex)
      this.isQuitBooking = true
    },
    canselQuitSelectedBooking () {
      this.isQuitBooking = false;
      this.selectedIndex = null;
    },
    selectUser (user) {
      this.$emit('select:user', user);
    },
    noSelectUser () {
      this.$emit("noSelected");
    },
    onMessage (content, date) {
      this.$emit("on:message", content, date);
    },

    otherUser (data) {
      this.$emit("otherUser", data)
    },
    // finalinfo (data) {
    //   console.log("Data in recipient panel " + data)
    //   this.$emit("finalinfo", data)
    // },
    handleInitializeChat (data) {
      this.$emit("initializeChat", data);
    },
    async handleRecipientBookings () {
      let bookings = await recipientService.getOwnBookings(this.userId);

      this.confirmedBookings = bookings.filter(booking => booking.status === "confirmed");

      this.clientConfirmedBookings = bookings.filter(cb => cb.status === "notSeen" || cb.status === "seen");

      if (this.recipientBookings > 0) {
        if (!this.recipientBookings[0].onTime.month)
          this.isSpinner = true;
      }

    },

    async handleRecipientResult (id, booking) {
      //this.isAvailable = true
      //console.log("Provider id is: " + id)

      //this.booking = await recipientService.getBookingById(id);
      this.booking = booking
      this.offers = booking.offers;
      //this.images = this.booking[0].image;


      if (this.booking.image)
        this.images = this.booking.image;

      console.log("Profession: " + this.booking.professional)
      let temp = []
      temp = this.booking.professional;
      console.log("Professional length " + this.booking.professional.length);

      this.recipientDateTime = new Date(booking.onTime[0].year, booking.onTime[0].month, booking.onTime[0].day, booking.onTime[0].hours, booking.onTime[0].minutes)
      console.log("Recipient datetime: " + booking.onTime[0].day)

      console.log("xxx " + this.recipientDateTime.getTime())
      // TODO siia veel mitmuse vorm elukutse sobivuse kohalt otsingus
      this.line = temp[0]


      this.providerMatchByProfession = await providerService.getProvidersMatchingByProfession(
          {result: temp}
      )

      // User's own company do not included
      this.providerMatchByProfession = this.providerMatchByProfession.filter(pro => pro.user.id !== this.userId);

      this.isBooking = true;
    },
    handleFilterProvider (content) {
      if (content === "distance") {
        this.booking.offers.sort((a, b) => a.distance - b.distance);
      } else if (content === "rating") {

        this.booking.offers.sort((a, b) => b.provider.rating.positive - a.provider.rating.positive);
        //this.providerMatchByProfession = this.providersAvailable + this.providersBusy;
      } else if (content === "price") {
        this.booking.offers.sort((a, b) => a.price - b.price);
      }
    },
    handleFilterByFeedback () {
      console.log("By feedback")
    },
    handleFilterAvailability () {
      console.log("Heyy here")

      this.providerMatchByProfession.forEach(pro => {
        console.log("Recipient time " + this.recipientDateTime)
        if (pro.timeoffer) {
          pro.timeoffer.forEach(time => {
            if (
                providerFit.providerMatchingForClient(
                    this.recipientDateTime,
                    {y: time.yearFrom, m: time.monthFrom, d: time.dayFrom, hour: time.hoursFrom, min: time.minutesFrom},
                    {y: time.yearTo, m: time.monthTo, d: time.dayTo, hour: time.hoursTo, min: time.minutesTo}
                )
            ) {
              console.log("Is available " + pro.yritys)
              this.providersAvailable.push(pro)
            } else {
              console.log("Is not available provider yritys " + pro.yritys)
              this.providersBusy.push(pro);
            }
          })
        } else {
          console.log("Not timeoffer setted")
        }

      })

      console.log("Available length " + this.providersAvailable.length)
      console.log("Not available length " + this.providersBusy.length)

    },
    handleOrderToSend (provId, booking, navbarChatUser) {
      console.log("Order is sended " + booking.id)
      //prov.id, this.booking, chatUserDataNavbar
      this.$emit("update:booking", booking.id);

      this.clientConfirmedBookings = this.clientConfirmedBookings.concat(this.booking);

    },
    newBooking () {

      this.$router.push('/rf')


    },

    openMap () {
      const test = "Tehnika 1-5, Antsla"
      this.$router.push('/recipient-public', {params: test});

    },
    compareTime () {
      console.log("Month is: " + monthConverter.month(4))

      // console.log("Time comparison: " + (new Date(2023,3, 20, 10, 20).getTime()
      //     < new Date(2023, 3, 20, 11, 11).getTime()))
    },
    removeConfirmationNotification () {

    },
    handleEditDescription (description) {
      this.booking.description = description;
    },

    // Adding booking image
    async handleAddImage (image, bookingID) {
      console.log("Image id in upload " + image._id)
      console.log("Image image in upload " + image.image)
      console.log("Image name in upload " + image.name)
      this.$emit("addImageToRecipientBookings", image, bookingID)
      this.images = [
          ...this.images,
          image
      ]


      //this.images.push(image);
      // this.$router.go()
      // this.isBooking = true;
    },
    handleEditImage (index, id, key, blob) {

      if (index !== -1) {
        this.images[index] = {_id: id, key: key, blob: blob};
      }

    },

    async handleRemoveImage (imageID) {
      //await recipientService.removeImage(this.booking[0].id, imageID);
      //this.images = this.images.filter(img => img._id !== imageID);
      this.images.splice(imageID, 1);
      console.log("Image removed from array")
    },
    handleCanselResult (back) {
      console.log("Canseled: " + back)
      this.isBooking = back;
    },
    async handleRemoveComplitedBookingPanel (booking) {
      const main_booking = await recipientService.getBookingById(booking.id);
      const room = main_booking.ordered[0].yritys + booking.user.username;
      this.$emit('archiveClientSideBooking', main_booking, room);
    },

    // id, included_rooms
    async handleRemoveOfferedBookings (booking, offers) {
      console.log("Removing booking id " + booking.id);
      this.isBooking = false;
      this.booking = null;
      // included_rooms
      this.$emit("removeBookingWithOffers", booking, offers);
      //await recipientService.removeBooking(id);

      //await recipientService.removeBooking(id);

    }
  }
}
</script>

<style scoped>

.bookings {
  font-size: 16px;
  text-align: left;
  /*padding: 5px;*/
}
.booking_time {
  color: #817d7d;
}


#info-block section {
  border: 1px solid #939696;
  margin-bottom: 20px;
}

#info-block-confirmed section {
  border: 1px solid #d5b13c;
  margin-bottom: 20px;
}

.file-marker > div {
  padding: 0 3px;
  /*height: 130px;*/
  /*margin-top: -0.8em;*/
  margin-top: -1em;
}

.box-title {
  background: #808687 none repeat scroll 0 0;
  border-radius: 50px;
  color: black;
  display: inline-block;
  /*padding: 0 2px;*/
  font-size: 16px;
  padding: 0 10px;

  margin-left: 8em;
}
.box-title-confirmed {
  /*background: #141414 none repeat scroll 0 0;*/
  background: #2e2b2b none repeat scroll 0 0;
  display: inline-block;
  color: #dddd;
  /*padding: 0 2px;*/
  font-size: 16px;
  padding: 0 10px;

  margin-left: 8em;
}
.box-contents {
  /*border: solid red;*/

  padding: 20px;
  overflow-y: auto;
}
.box-contents-confirmed {

  padding: 10px;
}
.date_expired {
  color: #c76868;
}
.order_expired {
  border: 1px solid #eb5454;
}
</style>