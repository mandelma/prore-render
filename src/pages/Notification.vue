<template>
  <div>

    <MDBContainer style="margin-top: 100px; position: relative;">

      <div>
        <img :src="require(`@/assets/left_back.png`)" alt="back" @click="backFromProNotifications" style="display: flex; justify-content: right;"/>
        <div v-if="bookings.length > 0">
          <MDBRow v-for="(booking, index) in bookings " :key="index" style="margin-bottom: 10px; padding: 20px;">
            <MDBCol  style="background: #2e2b2b; box-shadow: 0.3em 0.3em 1em rgba(104,101,101,0.6); padding: 30px; font-size: 18px" md="4"

                     :class="[{ activeHeader: index === bookingIndex && isBooking }]">
            <span v-if="!booking.visitors.some(id => id === userIsProvider.id)" :class="{'strong-tilt-move-shake': isNoLimit && index === bookingIndex}">
              <span class="new_notification" @click="messageSeen(booking, index)">
                <b>{{booking.user.username.length < HEADER_LENGTH ?booking.user.username : booking.user.username.substr(0, HEADER_LENGTH) + "..."}}</b><br>

                {{booking.header.length < HEADER_LENGTH ? booking.header : booking.header.substr(0, HEADER_LENGTH) + "..."}}

                <span style="display: flex; justify-content: right; color: deepskyblue; cursor: pointer">

                  {{booking.isIncludeOffers ? ( booking.offers.some(offer => offer.provider.id === userIsProvider.id || offer.provider.id === userIsProvider.id)
                    ? "Tarjous lähetetty" : "Lähetä tarjous")  : "Varmista tilaus"}}
                </span>



              </span>


            </span>

              <span v-else :class="{'strong-tilt-move-shake': isNoLimit && index === bookingIndex}">
              <span class="seen_notification" @click="messageSeen(booking, index)">


                <b>{{booking.user.username.length < HEADER_LENGTH ? booking.user.username : booking.user.username.substr(0, HEADER_LENGTH) + "..."}}</b><br>

                {{booking.header.length < HEADER_LENGTH ? booking.header : booking.header.substr(0, HEADER_LENGTH) + "..."}}

                <span style="display: flex; justify-content: right; color: deepskyblue; cursor: pointer">

                  {{booking.isIncludeOffers ? (  booking.offers.some(offer => offer.provider.id === userIsProvider.id) ? "Tarjous lähetetty" : "Lähetä tarjous")  : "Varmista tilaus"}}

                </span>

              </span>

            </span>

            </MDBCol>
            <MDBCol  md="8" :class="[{ activeHeader: index === bookingIndex && isBooking }]" >
              <h4
                  v-if="isNoLimitText && index === bookingIndex"
                  style="color: palevioletred; text-underline: cornflowerblue; cursor: pointer; margin-top: 10px;"
                  @click="$router.push('/pay-plan')"
              >
                Lataa lisää aikaa täältä
              </h4>

              <Booking

                  v-if="isBooking && index === bookingIndex"
                  :booking = booking
                  :bookingImages = bookingImages
                  :provider = userIsProvider
                  @set:room = handleSetRoom
                  @openChatPanel = handleOpenChatPanel
                  @init_offer = handleInitOffer
                  @create:offer = handleCreateOffer
                  :selected_room = room
                  :chatusers = chatusers
                  :messages = messages
                  @select:user = selectUser
                  @noSelected = noSelected
                  :selecteduser = selecteduser
                  @on:message = onMessage
                  @close:booking = handleCloseBooking
                  @confirm:booking = handleConfirmBooking
                  @reject_booking_no_offers = handleRejectBookingNoOffers
                  @rejectFormBooking = handleRejectFormBooking
                  :isDisableProNotOfferBtns = isDisableProNotOfferBtns
                  @confirmOfferAbort = handleConfirmOfferAbort
                  :isDisableProNotMapBtns = isDisableProNotMapBtns
                  @confirmMapOfferAbort = handleConfirmMapOfferAbort
              />
              <div v-else-if="creditLeft < 0 && index === bookingIndex">
                <h2 >Rajoitettu pääsy!</h2>
                <p
                    style="color: orangered; cursor: pointer;"
                    @click="$router.push('/pay-plan')"
                >
                  Lataa lisää aikaa
                </p>
              </div>
            </MDBCol>
          </MDBRow>
        </div>
        <div v-else>
          <h3>Ei näytettäviä tilauksia!</h3>
        </div>


      </div>
    </MDBContainer>

<!--    bookings {{bookings}}-->
<!--    <p style="color:red;">booking {{booking}}</p>-->
<!--    bookings -&#45;&#45; {{bookings.map(b => b.user.id)}}-->
  </div>

<!--  provider test {{providerTest}}-->

</template>

<script>
/* eslint-disable */
/*global google*/

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBTabs,
  MDBTabNav,
  MDBTabItem,
  MDBTabContent,
  MDBTabPane,
  MDBTable,
  MDBBtnClose,
  MDBBtn
} from "mdb-vue-ui-kit";
import { ref } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import monthConverter from '../components/controllers/month-converter'
import recipientService from '../service/recipients'
import providerService from '../service/providers'

import User from '../components/chatio/User'
import MessagePanel from '../components/chatio/MessagePanel.vue'
import chatContent from '../components/chatio/Chat'
import liveChat from '../pages/LiveChat'
import Booking from '../pages/Booking.vue'
//import selectUser from '../components/chatio/SelectUser.vue'
import socket from "@/socket";
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import offerService from "@/service/offers";
//import socket from '../socket'
export default {
  name: "client-notifications",
  props: {
    bookings: Array,
    chatusers: Array,
    activeUser: null,
    selecteduser: null,
    creditLeft: null,
    messages: Array,
    loggedInUser: Object,
    userIsProvider: Object,
    room: String,
    isDisableProNotOfferBtns: Boolean,
    isDisableProNotMapBtns: Boolean
  },
  components: {
    User,
    MessagePanel,
    PulseLoader,
    monthConverter,

    TabView,
    TabPanel,

    chatContent,
    liveChat,
    Booking,
    //recipientService,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBListGroup,
    MDBListGroupItem,
    MDBTabs,
    MDBTabNav,
    MDBTabItem,
    MDBTabContent,
    MDBTabPane,
    MDBTable,
    MDBBtnClose,
    MDBBtn
  },
  setup () {
    const activeTabId4 = ref('null');
    //const scrollableTabs = ref(Array.from({ length: 2 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` })));
    //const scrollableTabs = ref(Array.from({ length: 2 }, (_, i) => ({ title: `Tab ${i + 1}`, content: `Tab ${i + 1} Content` })));

    return {
      activeTabId4,
      //scrollableTabs
    }
  },

  data () {

    return {
      //bs: [],
      HEADER_LENGTH: 7,
      providerTest: null,
      selectedUser: null,
      userIn: null,
      allBookings: [],
      //proBookings: this.bookings,
      // Current provider id (this booking)
      providerID: null,

      isBooking: false,
      isOfferCreated: false,
      bookingID: null,
      pressed: false,
      bookingIndex: null,
      booking: {},
      drivingDistance: null,
      drivingDuration: null,
      bookingImages: [],

      currentRoom: "",
      isAccessTerminated: false,
      bookingDate: null,
      isSeen: false,
      isOpenImage: false,
      isImageOpen: false,
      srcImg: "",
      isChatOpen: false,
      isRenderData: false,

      loading: false,
      id: null,
      un: "sanna",
      ri: "",

      room: "",

      isChat: false,

      isPressedOpenChat: false,
      isPressedContactToUser: false,
      isConnection: false,

      isPressedFinal: false,

      count: 0,
      isNoLimit: false,

      isNoLimitText: false

    }
  },

  mounted () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (!loggedUserJSON) {
      this.$router.push('/')
    } else {
      const user = JSON.parse(loggedUserJSON)
      this.userIn = user
      //this.bs = this.bookings
      if (this.bookings.length === 0) {
        this.$router.go(-1);
      }
    }
    // if (this.bookings.length === 0) {
    //   this.$router.go(-1);
    // }

  },

  methods: {
    handleConfirmOfferAbort () {
      this.$emit("confirmOfferAbort");
    },
    handleConfirmMapOfferAbort () {
      console.log("Abort m from notification")
      this.$emit("confirmMapOfferAbort");
    },
    open (booking, index) {
      this.bookingIndex = index

      if (this.creditLeft > 0) {
        this.isBooking = true;
        const room = this.userIsProvider.yritys + booking.user.username;

        if (!booking.visitors.includes(this.userIsProvider.id)) {
          console.log("Visitors array includes user id")
          this.createChatPanel(true);
        }

        this.booking = booking;

        this.addVisitor(booking.id, {visitor: this.userIsProvider.id});

        // if (booking.status !== "offered") {
        //   this.editStatus(booking.id, "seen");
        // }
      }


      // if (this.creditLeft > 0) {
      //
      //   this.bookingImages = [];
      //   //bookingData.id;
      //   this.isBooking = true;
      //   console.log("booking id " + booking.id)
      //   console.log("userisprovider " + this.userIsProvider.id)
      //
      //   console.log("booking includes you! " + booking.visitors.length);
      //
      //   if (booking.image) {
      //
      //     // booking.image.forEach(img => {
      //     //   this.getImageSize (img.name)
      //     //       .then(item => {
      //     //         this.bookingImages = [
      //     //           ...this.bookingImages,
      //     //           {
      //     //             id: img._id,
      //     //             size: item.width + "-" +item.height,    //'1400-933', //item.size,
      //     //             src: require(`/server/uploads/${img.name}`),
      //     //             thumb: require(`/server/uploads/${img.name}`),
      //     //             subHtml: `<div class="lightGallery-captions">
      //     //       <h2>Terve</h2>
      //     //
      //     //   </div>"`
      //     //           }
      //     //         ]
      //     //       })
      //     //
      //     // })
      //   } else {
      //     this.isAccessTerminated = true;
      //   }
      //
      //
      //   this.isSeen = true;
      //
      //   this.booking = booking;
      //
      //   this.ri = this.userIsProvider.yritys + booking.user.username;
      //   console.log("Ri means: " + this.ri)
      //
      //   const room = this.userIsProvider.yritys + booking.user.username;




      //
      //   const username = this.userIn.username;
      //
      //   this.room = room;
      //   console.log("User is provider here: " + this.userIsProvider.user.id)
      //
      //
      //
      //   if (!booking.visitors.includes(this.userIsProvider.id)) {
      //     console.log("Visitors array includes user id")
      //     this.createChatPanel(true);
      //   }
      //
      //   this.addVisitor(booking.id, {visitor: this.userIsProvider.id});
      //
      //   this.id = booking.id;
      //
      //   if (booking.status !== "offered") {
      //     this.editStatus(booking.id, "seen");
      //   }
      //
      // } else {
      //   this.isNoLimitText = true;
      //   this.isNoLimit = true;
      //   setTimeout(() => {
      //     this.isNoLimit = false;
      //   }, 3000);
      //
      // }
    },
    backFromProNotifications () {
      //window.localStorage.removeItem('selectedChatUser');
      this.$router.go(-1)
    },
    // avajauuenda () {
    //   this.isChat = true;
    //   this.count++;
    // },

    selectUser(user) {
      this.$emit("select:user", user)
      //if (!user.self)
        //this.selectedUser = user;
    },

    noSelected () {
      this.$emit("noSelected");
    },

    onMessage(content, date) {
      this.$emit("on:message", content,date);

    },

    renderComponent () {
      this.isChat = true;

      socket.on('get updated room users', (data) => {
        console.log("xx-notification " + data.users.length)
        if(data.users.length > 1)
          this.isTwoUsersOnline = true;
      })

    },

    // async handleBookings () {
    //   const user = await providerService.getProvider(this.userIn.id)
    //   this.providerID = user.id;
    //   this.selectedPro = user.yritys;
    //
    //   if (user) {
    //     this.allBookings = user.booking.filter(bk => bk.status !== "offered" && bk.status !== "completed" && bk.status !== "confirmed" );
    //   }
    // },
    createBookingDate () {
      this.bookingDate = 22  //monthConverter(4);
    },
    async getImageSize (image) {
      let img = new Image();
      img.src = require(`/server/uploads/${image}`)
      await img.decode();
      let width = img.width;
      let height = img.height;
      return {
        width,
        height,
      }
    },
    handleOpenBooking (bookingData, index) {
      //if (((this.userIsProvider.proTime - new Date().getTime()) / 86400000).toFixed() > 0) {
        // const header = document.getElementById("header")
        //
        // console.log("Booking user id: " + bookingData.user.id)
        //
        //
        // this.bookingIndex = index  //bookingData.id;
        // this.isBooking = true;

        //this.pressed =  index === 1;
        // if (bookingData.id)
        //   header.style.backgroundColor = "red";
        //this.booking = bookingData;
        // if (bookingData.image) {
        //
        //   bookingData.image.forEach(img => {
        //     this.getImageSize (img.name)
        //         .then(item => {
        //           this.bookingImages = [
        //             ...this.bookingImages,
        //             {
        //               id: img._id,
        //               size: item.width + "-" +item.height,    //'1400-933', //item.size,
        //               src: require(`/server/uploads/${img.name}`),
        //               thumb: require(`/server/uploads/${img.name}`),
        //               subHtml: `<div class="lightGallery-captions">
        //         <h2>Terve</h2>
        //
        //     </div>"`
        //             }
        //           ]
        //         })
        //
        //   })
        // } else {
        //
        // }
      //}

    },
    handleCloseBooking () {
      this.isBooking = false;
    },

    handleSetRoom (room) {
      this.$emit("set:room", room);
    },

    createChatPanel (isCounter) {
      this.providerTest = this.userIsProvider;
      console.log("##pro " + this.userIsProvider.yritys)

      const provider = this.userIsProvider;
      const createChatRoom = {
        useCounter: isCounter,
        isActive: false,
        bookingID: this.booking.id,
        same_room_counter: 1,
        isOnline: false,
        room: this.room,
        pro: provider.yritys,
        bookerUsername: this.booking.user.username,
        bookerID: this.booking.user.id,
        providerUsername: provider.user.username,
        providerID: provider.user.id
      }
      const chatCredentials = {
        useCounter: isCounter,
        isActive: false,
        bookingID: this.booking.id,
        same_room_counter: 1,
        room: this.room,
        proID: provider.user.id,
        pro: provider.yritys,
        // userID: provider.user.id,
        // username: provider.user.username
        userID: this.booking.user.id,
        username: this.booking.user.username
      }

      this.$emit("initializeChat", {
        initChatRoom: createChatRoom,
        chatData: chatCredentials
      });
    },

    handleOpenChatPanel () {
      this.$emit("joinChatPanel", this.room);
    },

    async addVisitor (id, visitor) {
      const visited = await recipientService.addVisitor(id, visitor);
      console.log("VISITOR id is " + visitor.visitor);
      this.$emit("join:visitor", id, visitor.visitor);
    },

    messageSeen (booking, index) {
      this.bookingIndex = index

      if (this.creditLeft > 0) {

        this.bookingImages = [];
          //bookingData.id;
        this.isBooking = true;
        console.log("booking id " + booking.id)
        console.log("userisprovider " + this.userIsProvider.id)
        console.log("booking includes you! " + booking.visitors.length);
        if (booking.image) {
        } else {
          this.isAccessTerminated = true;
        }


        this.isSeen = true;

        this.booking = booking;

        this.ri = this.userIsProvider.yritys + booking.user.username;
        console.log("Ri means: " + this.ri)

        const room = this.userIsProvider.yritys + booking.user.username;

        const username = this.userIn.username;

        this.room = room;
        console.log("User is provider here: " + this.userIsProvider.user.id)

        this.addVisitor(booking.id, {visitor: this.userIsProvider.id});

        if (!booking.visitors.includes(this.userIsProvider.id)) {
          console.log("Visitors array includes user id")
          this.createChatPanel(true);
        }

        this.id = booking.id;


      } else {
        this.isNoLimitText = true;
        this.isNoLimit = true;
        setTimeout(() => {
          this.isNoLimit = false;
        }, 3000);

      }

    },
    handleInitOffer (booking) {
      //console.log("Initing the offer");
      this.calculateDistance(booking);
    },

    async calculateDistance (booking) {
      const pro = this.userIsProvider;
      const getDistanceMatrix = (service, data) => new Promise((resolve, reject) => {
        service.getDistanceMatrix(data, (response, status) => {
          if(status === 'OK') {
            resolve(response)
          } else {
            reject(response);
          }
        })
      });

      let start = []
      let end = [];

      //let drivingDistance;
      //let drivingDuration;

      let originLat = pro.latitude;
      let originLng = pro.longitude;
      start = [originLat, originLng];

      let destinationLat = booking.latitude;
      //console.log("Dest latitude " + destinationLat )
      let destinationLng = booking.longitude;
      end = [destinationLat, destinationLng];
      //console.log("Dest longitude --------- " + destinationLng )

      const getDistance = async (start, end) => {
        const origin = new google.maps.LatLng(start[0], start[1]);
        const final = new google.maps.LatLng(end[0], end[1]);
        const service = new google.maps.DistanceMatrixService();
        const result = await getDistanceMatrix(
            service,
            {
              origins: [origin],
              destinations: [final],
              travelMode: 'DRIVING'
            }
        )
        //this.drivingDuration = result.rows[0].elements[0].duration.text;
        return {
          distance: (result.rows[0].elements[0].distance.value / 1000).toFixed(1),
          duration: result.rows[0].elements[0].duration.text
        };
      };

      getDistance(start, end).then(res => {
        //console.log("DDxxiist " + res.distance)
        this.drivingDistance = res.distance;
        this.drivingDuration = res.duration;
      });

      //return {distance: drivingDistance, duration: drivingDuration}
    },

    async handleCreateOffer (price_offer, place, zone, note, booking) {
      const pro = this.userIsProvider;
      //console.log("Booking offers length " + booking.offers.length);

      // TODO Kontrollida kaugused, annavad eri tulemusi!!

      if (booking.offers.length >= 3) {
        console.log("Olet myöhässä, tarjoukset ovat yo lähetetty")
        const booking_data = await recipientService.getBookingById(booking.id);
        this.$emit("offer_limit_is_loaded", this.room, booking);
        socket.emit("offer limit is loaded", this.room, booking_data);
        //this.$emit("create:offer", created_offer, booking, false);
      } else {
        console.log("Jaa, saab luua pakkumise!!")
        const offer = {
          bookingID: booking.id,
          room: this.room,
          name: pro.yritys,
          area: zone,
          isGo: place,
          distance: this.drivingDistance,
          duration: this.drivingDuration,
          price: price_offer,
          place: place,
          description: note,
          provider: pro.id
        };

        const created_offer = await offerService.addOffer(offer);
        if (created_offer) {
          created_offer.provider = pro;
          this.isOfferCreated = true;
        }

        this.allBookings = this.allBookings.filter(b => b.id !== booking.id);
        this.isBooking = false;
        const created_booking = await recipientService.createOffer(booking.id, created_offer.id);
        //booking.ordered.push(pro);
        this.$emit("create:offer", created_offer, booking)
        const newBooking = booking;
        console.log("BBBBBBBB booking " + booking.user.id)

        newBooking.offers.concat(created_offer);
        socket.emit("send offer", booking, created_offer);
      }

    },
    async editStatus (id, status) {
      const update = {
        status: status
      }
      const updatedStatus = await recipientService.updateRecipient(id, update);
      console.log("Is status updated: " + updatedStatus.status);
      this.$emit('update:status', id)
    },

    async handleConfirmBooking (booking) {
      console.log("Booking header " + booking.header)
      console.log("confirmed booking id " + booking.id)
      console.log("Confirmed booking user id " + booking.user.id)

      await this.editStatus (booking.id, "confirmed")

      const realTimeBooking = await recipientService.getBookingById(booking.id);

      this.$emit("confirm_client_booking", booking);
      this.isBooking = false;

      socket.emit("accept recipient booking", {
        id: realTimeBooking.user.id, //booking.user.id,
        booking: realTimeBooking

      })

    },
    closeImagePanel () {
      this.isOpenImage = false;
      this.isImageOpen = false;
    },
    async handleRejectFormBooking (booking) {
      const rejFormBooking = await recipientService.getBookingById(booking.id)
      this.isBooking = false;
      this.$emit("reject_pro_form_booking", this.room, booking, this.userIsProvider.id);
      socket.emit("reject form booking by pro", {
        id: rejFormBooking.user.id,
        room: this.room,
        booking: booking
      })
    },
    async handleRejectBookingNoOffers (booking, reason) {
      const rejBooking = await recipientService.getBookingById(booking.id)
      const userIdToSend = rejBooking.user.id;

      this.isBooking = false;

      this.$emit("reject_bookingByPro_no_offers", rejBooking, this.room, this.userIsProvider.id);
      socket.emit("reject map booking by pro", {
        id: userIdToSend,
        room: this.room,
        pro: this.userIsProvider.yritys,
        booking: booking,
        reason: reason
      })

      await recipientService.removeBooking(booking.id);

      console.log("Test pro id " + userIdToSend)
      //this.bookings = this.bookings.filter(b => b.id !== booking.id);
      // if (this.bookings.length < 1) {
      //   //this.$router.push('/');
      //   this.$router.go(-1);
      // }
    },


    // exitFromNotificationData () {
    //   location.reload();
    // }
  },
}
</script>

<style scoped>
.dataContainer {
  border: solid 1px #66aab1;
  padding: 20px;
}
.closeData {
  float: right;
}
.closeData:hover {
  color: red;
}
b, p {
  cursor:pointer;
  font-size: 16px;
}

b {
  font-weight: bold;
  font-size: 2rem;
  color: #ed8b49;
}

/*img.loading {
  width: 100%;
  height: 400px;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif) no-repeat scroll center center;
}*/
#header {
  padding: 20px;
  background-color: #878383;
  font-size: 18px;
}

.activeHeader {
  padding: 20px;
  background-color: #2d2e2d;

  font-size: 18px;
}

.new_notification {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d55b5b;
}
.seen_notification {
  font-size: 1.5rem;
}

span {

  /*background: #48abe0;*/
  /*color: white;*/
  /*padding: 1.5rem;*/
  /*font-size: 2rem;*/
  display: inline-block;
}

span.strong-tilt-move-shake {
  animation: tilt-n-move-shaking 0.15s;
}

@keyframes tilt-n-move-shaking {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(5deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-5px, 5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
.close_btn {
  position: absolute;
  right: 20px;
  top: -30px;
  cursor: pointer;
  font-weight: bold;
}

</style>