<template>
  <div class="textSize">
<!--    <MDBRow>-->
<!--      <MDBCol>-->

<!--      </MDBCol>-->

<!--    </MDBRow>-->

    <MDBRow style="margin-top: 17px;">
      <MDBCol class="proPanelHeader" md="4">

        <div class="pro-panel-header">
          <div class="header-content">
            <h2>{{provider.yritys}}</h2>
            <h2>{{provider.address}}</h2>
          </div>

        </div>

      </MDBCol>

    </MDBRow>
<!--    v-if="isProviderCalendar"-->
    <MDBContainer style="margin-bottom: 50px;">
      <calendar

          :userIsProvider = userIsProvider
          :bookings = bookings
          :filled_days = filled_days
          :filled = filled
          :bookingsConfirmed = bookingsConfirmed

          :client_filled_days = client_filled_days
          :client_filled = client_filled
          :confirmedBookingsByProvider = confirmedBookingsByProvider
      />



      <MDBRow>


        <MDBCol>
          <div v-if="!provider.profession" class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div v-else class="pro-panel">
            <error-notification
                :message = rangeErrorMessage
            />
            <errorNotification
                :message = errorMessage
            />
            <successNotification
                :message = successMessage
            />

            <MDBTable responsive borderless class="proPanelTable" style="">
              <tbody>
              <tr >
                <td>
                  {{provider.range === 0 ? "Tarjoan palvelua paikalla" : "Palvelun säde: " + provider.range + " km"}}
                </td>
                <td v-if="!isEditRange">
                  <MDBBtn outline="info" block size="sm" @click="isEditRange = true">Muokkaa toimintaalueetta</MDBBtn>
                </td>
                <td v-else>
                  <div style="border: solid #ddd; margin-bottom: 10px; padding: 7px; ">
                    <div style="display: flex; justify-content: right; padding: 10px;">
                      <MDBBtnClose
                          white
                          @click="isEditRange = false"
                      />
                    </div>
                    <div>
                      <MDBInput white label="Säde - km" v-model="range" size="sm" type="number" /><br>
                    </div>

                    <MDBBtn v-if="range.length > 0" outline="info" block size="sm" @click="saveNewRange">Tallenna uusi säde</MDBBtn>
                  </div>

                </td>
              </tr>
              <tr>
                <td :class="{hide: isFeedback}">
                  Palaute
                </td>
                <td v-if="isFeedback" colspan="2">


                  <feedback-list
                      :feedback = provider.feedback
                      @closeFeedbackList = handleCloseFeedbackList
                  />
                </td>
                <td v-else>
                  <MDBRow class="rating">
                    <div >
                      <p class="ratingData">{{provider.rating.positive > 0 ? provider.rating.positive / provider.rating.count : "0"}} tähteä &nbsp; ( yhteensä   {{provider.rating.count}} antajaa )</p>

                    </div>

                    <MDBCol >

                      <div style="text-align: center;">
                        <rating-stars :rating = "(provider.rating.positive / provider.rating.count)"  />
                      </div>


                    </MDBCol>
                    <MDBCol sm="12" v-if="provider.feedback.length > 0">
                      <MDBBtn block outline="warning" @click="getFeedbackListData">Saatu arvostelut &nbsp; <span>( {{ provider.feedback.length }} )</span></MDBBtn>
                    </MDBCol>

                  </MDBRow>

                </td>
              </tr>

              <tr>
                <td>
                  Portfolio
                </td>
                <td v-if="!isEditPortfolio">
                  {{ proDescription }}
                  <div style="display: flex; justify-content: right; color: green; cursor: pointer;">
                    <p @click="isEditPortfolio = true">Muokkaa</p>
                  </div>

                </td>

                <td v-else>
                  <p style="display: flex; justify-content: right; padding: 7px;" @click="isEditPortfolio = false">Poistu</p>
                  <MDBTextarea
                      maxlength="100"
                      label="Muokkaa kuvausta..."
                      white
                      rows="3"
                      v-model="des"

                      wrapperClass="mb-4"
                  />
                  <MDBBtn v-if="des.length > 0" outline="success" @click="getDescriptionContent">Varmista</MDBBtn>
                  <span style="float: right;">{{ des.length }} / 100</span>

                </td>
              </tr>

              <tr>

                <td :class="{hide: isEditProfession}">
                  <div v-for="(pro, i) in provider.profession" :key="i">
                    {{pro}}
                  </div>

                </td>
                <td v-if="isEditProfession" colspan="2">
                  <edit-profession
                      :provider = provider
                      @additionalProfession = handleAddProfession
                      @editProfession = handleEditProfession
                      @removeProfession = handleRemoveProfession
                      @cancel:editProfession = handleCancelEditProfession
                  />
                </td>
                <td v-else>
                  <MDBBtn outline="info" block size="sm" @click="editProfessionPro">Muokkaa osaamista</MDBBtn>
                </td>
              </tr>

              <tr>
                <td :class="{hide: isEditPrice}">
                  {{provider.priceByHour}}&nbsp;Euroa
                </td>
                <td v-if="isEditPrice" colspan="2">
                  <editPrice
                      :currentPrice = provider.priceByHour
                      @cancel:editPrice = cancelEditPrice
                      @save:editedPrice = saveEditedPrice
                  />
                </td>
                <td v-else>
                  <MDBBtn outline="info" block size="sm" @click="editPrice">Muokkaa tuntihinta</MDBBtn>
                </td>
              </tr>
              <tr>
                <td>
                  Katso kartalta
                </td>
                <td>
                  <MDBBtn outline="info" block size="sm" @click="this.$router.push('/pro-public-search')">Kartalta</MDBBtn>
                </td>
              </tr>

              </tbody>
            </MDBTable>

          </div>

        </MDBCol>

      </MDBRow>


    </MDBContainer>
  </div>


</template>

<script>

/* eslint-disable */


import VueDatePicker from '@vuepic/vue-datepicker';
import providerService from '../service/providers'
import editPrice from '../components/EditPrice'

import editProfession from '../components/EditProfession'

import errorNotification from '../components/notifications/errorMessage'
import successNotification from '../components/notifications/successMessage'
//import infoNotification from '../components/notifications/infoMessage'
//import monthConverter from '../components/controllers/month-converter'
import calendar from '../pages/Calendar'
import info from '../components/CompletedBookingPanel'
import '@/css/style.css';
import '@/css/notification.css'

//import validateToken from "@/components/validateToken";
import socket from "@/socket";
// inline auto-apply
import {
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBBtn,
  MDBBtnClose,
  MDBBadge,
  MDBInput,
    MDBTextarea
}from "mdb-vue-ui-kit";
import {ref, watchEffect} from "vue";
import  { DatePickerInstance } from "@vuepic/vue-datepicker"

import addDays from "date-fns/addDays";
import availableService from '../service/calendarOffers';
import FeedbackList from "@/components/FeedbackList";
import ratingStars from '@/components/RatingStars'

import Gallery from '@/pages/Gallery.vue'



//import socket from "@/socket";
export default {
  name: "Provider-panel",
  props: {
    userIsProvider: null,
    proDescription: {
      type: String,
      required: true
    },
    bookings: Array,
    filled_days: Array,
    filled: Array,
    bookingsConfirmed: Array,

    client_filled_days: Array,
    client_filled: Array,
    confirmedBookingsByProvider: Array

  },
  components: {
    Gallery,
    FeedbackList,
    calendar,
    ratingStars,
    info,
    //liveChat,
    errorNotification,
    successNotification,
    //infoNotification,
    //monthConverter,
    editPrice,
    editProfession,
    MDBContainer,
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBTable,
    MDBBtn,
    MDBBtnClose,
    MDBBadge,
    MDBInput,
    MDBTextarea,
    VueDatePicker
  },
  data () {
    const watchEffect = (() => {
      // if (this.filled_days.length > 0) {
      //
      // }
      // this.setHighlights()
      addDays(new Date(), 1)

    })
    const date = ref()
    //const startTime = ref([{ hours: 10, minutes: 5 }, { hours: 12, minutes: 10 }]);
    const startTime = ref([{ hours: new Date().getHours(), minutes: new Date().getMinutes() }, { hours: new Date().getHours(), minutes: new Date().getMinutes() }]);
    //const startTime = ref()

    return {
      dateForTimeEdit: null,
      date,
      //startTime: date,
      //startTime: [{ hours: 10, minutes: 5 }, { hours: 12, minutes: 10 }],
      startTime,
      editMarkedTimeID: null,
      editMarketIndex: null,
      activeDate: null,

      setMarkers: null,
      dayMarkerData: [],
      isEditTime: false,
      selfProvider: this.userIsProvider,
      confirmedBookings: [],
      testi: {},
      // un: "",
      // ri: "",
      rooms: [],
      close: true,
      isGallery: false,
      proImages: [],

      isCalendarVisible: false,

      //filled: [addDays(new Date(), 4)],
      //filled: [addDays(new Date(), 2)],
      //filled: [addDays(new Date(), 25 - new Date().getDate())],
      //filled: [],
      filledTimes: [],
      dayPanelIndex: null,
      isHandleTask: false,

      isPortfolio: false,
      isEditPortfolio: false,
      portfolioContent: "",
      des: this.proDescription,
      watchEffect
      //plugins: [lgThumbnail, lgZoom],

    }
  },
  setup () {

    const isProviderCalendar = ref(false)
    const testii = ref(null)
    const weekDay = ref("")
    const timerange = ref(null)
    const datee = ref(null)
    const range =ref("")
    const isRangeSelected = ref(false)
    const isEditRange = ref(false)
    const isEditPrice = ref(false)
    const isFeedback = ref(false)
    const isEditProfession = ref(false)
    const clearTime = ref(null)
    const dateTest = ref(null)
    //const date = ref()   //ref([new Date(), new Date()])

    const markers = ref([])
    //const filled = ref([])
    const contents = ref([])
    const isContents = ref(false)
    const markedDays = ref([])
    const time = ref({})
    const isConfirmTime = ref(false)
    const times = ref([])
    const datetime = ref({})
    const userId = ref("")
    const provider = ref({})
    const creditLeft = ref(null)
    const providerTimes = ref([])
    const errorMessage = ref(null)
    const successMessage = ref(null)
    const timeEditSuccessMessage = ref(null)
    const timeEditErrorMessage = ref(null)
    const rangeErrorMessage = ref(null)
    const oblicationInfoMessage= ref(null)
    const editTime = ref({})
    const isTimeToEdit = ref(false)
    const editArr = ref([])
    const timeToEdit = ref(null)
    const isDisplayConfirmed = ref(false)

    //const startTime = ref(this.activeDate === new Date.getDate() ? [{ hours: 10, minutes: 5 }, { hours: 12, minutes: 10 }] : [{ hours: 0, minutes: 0 }, { hours: 0, minutes: 0 }]);
    const highlightedDates = ref([
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 7),
    ])
    // const fi = () => {
    //
    //   this.filled_days.forEach(fd => {
    //     let filledDay = null;
    //     if (fd.month === new Date().getMonth()) {
    //       //filledDay = addDays(new Date(), fd[0].day   - new Date().getDate());
    //       filledDay = addDays(new Date(), 3)
    //
    //     }
    //     this.filled = this.filled.concat(filledDay);
    //   })
    // }
    return {
      isProviderCalendar,
      testii,
      weekDay,
      timerange,
      datee,
      range,
      isRangeSelected,
      isEditRange,
      isEditPrice,
      isFeedback,
      isEditProfession,
      clearTime,
      dateTest,
      //date,
      markers,
      //filled,
      contents,
      isContents,
      markedDays,
      time,
      isConfirmTime,
      times,
      datetime,
      userId,
      provider,
      creditLeft,
      providerTimes,
      errorMessage,
      timeEditSuccessMessage,
      timeEditErrorMessage,
      rangeErrorMessage,
      oblicationInfoMessage,
      successMessage,
      editTime,
      isTimeToEdit,
      editArr,
      timeToEdit,
      watchEffect,
      highlightedDates,
      isDisplayConfirmed,

    }
  },
  mounted () {
    if (this.userIsProvider)
      this.portfolioContent = this.userIsProvider.description;
    // console.log("Filled days length " + this.filled_days.length)
    // this.filled_days.forEach(fd => {
    //   console.log("hddddddddddddddddddddd")
    //   this.filled = [
    //     ...this.filled,
    //     addDays(new Date(), fd.day - new Date().getDate())
    //   ]
    // })
  },

  beforeMount () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (!loggedUserJSON) {
      this.$router.push('/');
    } else {
      this.portfolioContent = this.proDescription;
      const user = JSON.parse(loggedUserJSON)
      this.userId = user.id

      this.providerData();
      //this.createFilledTimes();

    }

  },
  // computed: {
  //   des: {
  //     get() {
  //       return this.proDescription || "";
  //     },
  //     set(val) {
  //       this.$emit('update:modelValue',this.proDescription + val);
  //     }
  //   }
  // },
  watch: {
    proDescription(newVal) {
      this.des = newVal; // react to prop changes (e.g., after refresh)
    },
  },
  methods: {
    async getDescriptionContent () {
      console.log("Changes?? " + this.des);
      console.log("Changes 2 ?? " + this.des);
      const content = this.des;
      await providerService.editPortfolio(this.userIsProvider.id, {description: this.des});
      this.$emit("editPortfolio", this.des);
      this.des = content;
      this.isEditPortfolio = false;
    },

    // handleUpdateGallery (img) {
    //   // this.proImages = [
    //   //     ...this.proImages,
    //   //     img
    //   // ]
    //   this.proImages.push(img);
    // },
    openTask (index) {
      this.dayPanelIndex = index;
      this.isHandleTask = true;
      //this.isDisplayConfirmed = !this.isDisplayConfirmed;
      this.isDisplayConfirmed = true;
      console.log("Index in open - " + index);
    },
    closeTask (index) {
      this.dayPanelIndex = null;
      this.isHandletask = false;
      this.isDisplayConfirmed = false;
      console.log("Index in close - " + index);
    },

    closeDayPanel () {
      this.isTimeToEdit = false;
      this.isEditTime = false;
      this.isDisplayConfirmed = false;
      this.dayPanelIndex = null;
    },

    goToMap () {
      this.$router.push('/provider-public')
    },

    getDate () {
      const today = new Date().getTime();
      //const tomorrow = new Date(86400000);
      const addWeek = new Date().getTime() + (7 * 86400000)
      //console.log("Today is: " + today)

      const day_ms = 86400000;
      console.log("and now " + today)
      console.log("week_ms added  is: " + addWeek);

      const days = (addWeek - today) / day_ms;

      console.log("Days between - " + days)
    },

    saveNewRange () {
      const rangeInt = parseInt(this.range);

      if (rangeInt > 0) {
        if (this.range.includes(",")) {
          this.range = "";
          this.rangeErrorMessage = "Pilkku (,) ei ole sallittu merkki, laita piste (.)!";
          setTimeout(() => {
            this.rangeErrorMessage = null;
          }, 3000);
        } else {
          this.isEditRange = false;
          providerService.editRange(this.provider.id, {range: this.range});
          this.provider.range = this.range;
        }

      } else {
        this.range = "";
        this.rangeErrorMessage = "Säde tulee olla positiivinen numero!";
        setTimeout(() => {
          this.rangeErrorMessage = null;
        }, 3000);
      }

    },

    getIt () {
      let username = "aaa"
      let room = "room"

      socket.auth = { username, room };
      socket.connect();

      let room1 = "Oopersama"
      socket.emit('updateRoom', room1);
    },

    // xxx(test) {
    //   console.log("Test nimi " + test)
    //
    //
    // },

    joinAllRooms () {
      const rooms = ["111", "222"];
      socket.emit('joinAllClientRooms', rooms);
    },

    handleRemoveProConfirmed (booking) {
      console.log("Info closed here?? " + booking.header)
      this.$emit("removeProBookingConfirmed", booking);
      this.confirmedBookings = this.confirmedBookings.filter(cp => cp.id !== booking.id);
      this.successMessage = "Siit saab kustutada selle teavituse soovi korral!"
      setTimeout(() => {
        this.successMessage = null
      }, 3000)

    },

    socketResetTest() {
      //console.log("Socket reset test")
      socket.disconnect()
      socket.connect()
    },
    openChatPanel (evt) {
      evt.preventDefault()
      console.log("Will chat open...")
      const sessionID = localStorage.getItem("sessionID");

      if (sessionID) {
        this.usernameAlreadySelected = true;
        socket.auth = { sessionID };
        socket.connect();
      }

      socket.on("session", ({ sessionID, userID, roomName }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);


            // save the ID of the user
            socket.userID = userID;
            socket.roomName = roomName;
      });
      /*this.$router
          .push({ path: '/chat' })
          .then(() => { this.$router.go() })
      */
    },
    createOrdered (date) {

    },
    handleInternal (date) {
      this.editArr = [];

      let editarr = []
      this.dayMarkerData = [];
      this.editTime = {}
      //let editTimeArr = []
      this.isTimeToEdit = false;
      if (date) {
        console.log("DATE" + date[0].getDate())

        this.activeDate = date[0].getDate();
        this.dateForTimeEdit = date;

        console.log("get date " + this.activeDate)
        let dateStr = date.toString().substring(8, 10)
        let dateInt = parseInt(dateStr);

        this.weekDay = date.toString().substring(0, 3)

        let time = {}
        let content = {}

        console.log("length xxxxxxxx " + this.markers.length)

        this.filled_days.forEach(f => {
          if (dateInt === f.day) {
            console.log("On")
            this.isTimeToEdit = true;
            editarr.push({
              type: "highlight",
              day: dateInt,
              weekDay: this.weekDay,
              hours: f.hours,
              minutes: f.minutes,
              booking: this.bookingsConfirmed.filter(bc => bc.onTime[0].day === dateInt)
            });

          } else {
            console.log("Ei ole")
          }

        })

        let isCompared = false;
        const markerType = ""

        const markerContents = [];
        this.markers.forEach(m => {
          if (m.date.getDate() === dateInt) {
            isCompared = true;
            this.isTimeToEdit = true
            time = {
              type: "marker",
              day: dateInt,
              weekDay: this.weekDay,
              time: m.content
            }
            markerContents.push(m.content);
            this.editArr.push(time)
          }

        })

        if (isCompared) {
          this.dayMarkerData = this.dayMarkerData.concat({
            type: "marker",
            day: dateInt,
            weekday: this.weekDay,
            time: markerContents

          })

        }

        this.times = []
        if (this.providerTimes) {
          this.providerTimes.forEach(offer => {
            this.initializeTime(offer);
          })
        }

        this.editArr = this.editArr.concat(editarr);
        this.dayMarkerData = this.dayMarkerData.concat(editarr);

      }


    },
    onTimePickerOpen (date) {

      console.log("Timepicker open! ")
    },
    onTimePickerClose () {
      console.log("Timepicker is closed!")
    },

    onOverlayToggle (overlay) {
      console.log(`Overlay ${overlay.overlay} is ${overlay.open ? 'opened' : 'closed'}`);
    },
    editPrice () {
      this.isEditPrice = true;
    },

    async saveEditedPrice (newPrice) {
      //console.log("New price is: " + newPrice);
      const providerSalary = {
        priceByHour: newPrice
      }
      const updated = await providerService.updateProvider(this.provider.id, providerSalary)
      if (updated) {



        this.provider.priceByHour = newPrice;
        console.log("Price: " + this.provider.priceByHour)
        this.isEditPrice = false;
        this.successMessage = "Tuntihinta on muokattu!"
        setTimeout(() => {
          this.successMessage = null
        }, 2000)
      }


    },
    cancelEditPrice (isEdit) {
      this.isEditPrice = isEdit;
    },
    getFeedbackListData () {
      this.isFeedback = true;
    },
    handleCloseFeedbackList () {
      this.isFeedback = false;
    },
    editProfessionPro () {
      this.isEditProfession = true;

    },
    handleEditProfession (index, profession) {

      console.log("Profession is " + profession + " and index " + index);
      this.provider.profession[0] = profession;
      providerService.editProfession(this.provider.id, {index: index, pro: profession});
    },
    handleAddProfession (pro) {
      console.log("Uus amet on " + pro);
      providerService.additionalProfession(this.provider.id, {profession: pro});
      if (!this.provider.profession.includes(pro)) {
        this.provider.profession.push(pro);
      }

    },
    handleRemoveProfession (index, profession) {
      console.log("Profession index is " + index + " and profession is " + profession);
      providerService.removeProfession(this.provider.id, {profession: profession})
      this.provider.profession.splice(index, 1);
    },

    handleCancelEditProfession () {
      this.isEditProfession = false;
    },
    // removeExpiredDateTime () {
    //   this.providerTimes.forEach(timerange => {
    //     let year = timerange.yearFrom;
    //     let month = timerange.monthFrom;
    //     let day = timerange.dayFrom;
    //     let hour = timerange.hoursFrom;
    //     let minute = timerange.minutesFrom;
    //     if (new Date(year, month, day, hour, minute).getTime() < new Date().getTime()) {
    //       //this.delTimeRange(timerange.id);
    //       this.removeExpiredTimeMarker(timerange);
    //     }
    //   })
    //
    // },
    async editTimeTest () {
      const newTimeoffer = {hoursFrom: 1};
      await availableService.updateOffer('6431407f53469b1f48eeb2f0', newTimeoffer)
    },
    updateTimesAndMarkers () {

      this.providerTimes.forEach(times => {
        console.log("Provider times: " + times.hoursFrom);
        this.setTimeMarkers(times)
      })

      this.providerTimes.forEach(offer => {
        this.initializeTime(offer);
      })
    },
    // async removeExpiredTimeMarker (marker) {
    //   console.log("Expired--- " + marker.id)
    //
    //   await availableService.removeTimeOffer(this.provider.id, marker.id);
    //   this.markers = this.markers.filter(marker => marker.content.timeId !== marker.id);
    //   this.providerTimes = this.providerTimes.filter(time => time.id !== marker.id);
    //   console.log("M pikkus " + this.markers.length)
    // },
    async delTimeRange (timerangeId, index) {
      await availableService.removeTimeOffer(this.provider.id, timerangeId);

      console.log("Id argumendina? " + timerangeId)

      this.times.splice(index, 1);

      this.providerTimes = this.providerTimes.filter(time => time.id !== timerangeId);


      this.markers = this.markers.filter(marker => marker.content.timeId !== timerangeId);

      console.log("MARKERS LEN " + this.markers.length)

      this.dayMarkerData = this.dayMarkerData.filter(dpd => dpd.type === "marker");

      if (this.dayMarkerData.length > 1) {
        this.dayMarkerData = this.dayMarkerData.filter(item => item.time.some(it => it.timeId !== timerangeId))

      } else {
        console.log("Something else!!")
        this.dayMarkerData[0].time = this.dayMarkerData[0].time.filter(item => item.timeId !== timerangeId);
      }
      if (this.dayMarkerData[0].time.length === 0) {
        this.isTimeToEdit = false;
      }
    },

    onClose () {

      console.log("On close...")
    },
    async handleDate () {
      console.log("Date handled!")
      const timeDate = {
        yearFrom: this.date[0].getFullYear(),
        monthFrom: this.date[0].getMonth(),
        dayFrom: this.date[0].getDate(),
        hoursFrom: this.date[0].getHours(),
        minutesFrom: this.date[0].getMinutes(),
        yearTo: this.date[1].getFullYear(),
        monthTo: this.date[1].getMonth(),
        dayTo: this.date[1].getDate(),
        hoursTo: this.date[1].getHours(),
        minutesTo: this.date[1].getMinutes()
      }




      const savedTimeRange = await availableService.addAdditionalOffer(this.provider.id, timeDate);

      console.log("Provider times " + this.providerTimes)

      this.providerTimes = this.providerTimes.concat(savedTimeRange);

      this.times = [];
      this.markers = [];

      this.providerTimes.forEach((times, index) => {
        this.setTimeMarkers(times, index)
        this.initializeTime(times);
      })


      // NB ------------------------------------------------------

      let dayHighlightData = [];

      let time = {}
      this.editArr = [];
      this.dayMarkerData = [];

      console.log("------------- PT -------- " + this.providerTimes.length)
      console.log("------------- ML --------- " + this.markers.length)

      this.filled_days.forEach(f => {
        if (this.date[0].getDate() === f.day) {
          console.log("On")
          this.isTimeToEdit = true;
          dayHighlightData.push({
            type: "highlight",
            day: this.date[0].getDate(),
            weekDay: this.weekDay,
            hours: f.hours,
            minutes: f.minutes,
            booking: this.bookingsConfirmed.filter(bc => bc.onTime[0].day === this.date[0].getDate())
          });

        } else {
          console.log("Ei ole")
        }

      })
      let d;

      //TODO siin probleem
      const timeContents = [];
      this.markers.forEach(m => {
        if (m.date.getDate() === savedTimeRange.dayFrom) {
          this.isTimeToEdit = true;
          time = {
            day: savedTimeRange.dayFrom,
            weekDay: this.weekDay,
            time: m.content
          }
          timeContents.push(m.content)
          //this.editArr.push(time);

        }

      })

      this.dayMarkerData = this.dayMarkerData.concat({
        type: "marker",
        day: savedTimeRange.dayFrom,
        weekday: this.weekDay,
        time: timeContents
      })
      // this.dayPanelData = {
      //   type: "marker",
      //   day: savedTimeRange.dayFrom,
      //   weekday: this.weekDay,
      //   time: timeContents
      //
      // }
      this.dayMarkerData = this.dayMarkerData.concat(dayHighlightData);
    },
    async confirmEditedTime (id) {
      console.log("Confirmed??? " + id + " hours edited: " + this.t)
      let offerForEdit;
      const time = this.timeToEdit
      if (time) {
        //this.markers = [];

        offerForEdit = {
          hoursFrom: time[0].hours,
          minutesFrom: time[0].minutes,
          hoursTo: time[1].hours,
          minutesTo: time[1].minutes
        }

        const edited = await availableService.updateOffer(id, offerForEdit)
        console.log("Offer edited: " + edited)
        this.timeEditSuccessMessage = "Aika muokattu onnistuneesti!"
        //this.providerTimes = this.providerTimes.filter(time => time.id !== id ? time : edited);




        this.isEditTime = false;

        //this.providerTimes = this.providerTimes.concat(edited)

        //this.testii = edited;



        //console.log("Times after edit:: ")
        setTimeout(() => {
          this.timeEditSuccessMessage = null
        }, 2000)
        this.isTimeToEdit = false;
      } else {
        this.timeEditErrorMessage = "Ensin on vaihdettava kellonaika!"
        setTimeout(() => {
          this.timeEditErrorMessage = null
        }, 2000)
      }
      //this.updateTimesAndMarkers();

      //console.log("Time need to confirmation: " + time[0].hours + " : " + time[0].minutes)
      this.timeToEdit = null;

    },
    onEdit (id, index) {
      console.log("Editing time id " + id)
      console.log("Index on " + index)
      this.editMarkedTimeID = id;
      this.editMarketIndex = index;


      this.isEditTime = true;

    },
    async handleTime (date) {

      this.xxx = date
      console.log("Time is handled " + date[0].hours + " " + date[1].hours )
      console.log("ID NOW HERE" + this.editMarkedTimeID)

      const offerForEdit = {
        hoursFrom: date[0].hours,
        minutesFrom: date[0].minutes,
        hoursTo: date[1].hours,
        minutesTo: date[1].minutes
      }

      this.times[this.editMarketIndex] = [{hours: date[0].hours, minutes: date[0].minutes}, {hours: date[1].hours, minutes: date[1].minutes}];


      const edited = await availableService.updateOffer(this.editMarkedTimeID, offerForEdit)
      console.log("Offer edited: " + edited)
      this.timeEditSuccessMessage = "Aika muokattu onnistuneesti!";

      setTimeout(() => {
        this.timeEditSuccessMessage = null
      }, 2000)
      this.isTimeToEdit = false;

      this.providerTimes = this.providerTimes.filter(time => time.id !== this.editMarkedTimeID ? time : edited);

      const startHours = date[0].hours >= 10 ? date[0].hours : "0" + date[0].hours;
      const endHours = date[1].hours >= 10 ? date[1].hours : "0" + date[1].hours;
      const startMinutes = date[0].minutes >= 10 ? date[0].minutes : "0" + date[0].minutes;
      const endMinutes = date[1].minutes >= 10 ? date[1].minutes : "0" + date[1].minutes;
      let newTimeContent = startHours + " : " + startMinutes + " - " + endHours + " : " + endMinutes;

      this.markers.map(marker => marker.content.timeId === this.editMarkedTimeID ? marker.content.text = newTimeContent : marker);

      this.isEditTime = false;
      //this.isConfimTime = true;
      this.timeToEdit = date;

    },

    setMarkedDay (markedDay) {
      const day = markedDay - new Date().getDate()
      //this.markedDays = this.markedDays.concat(markedDay)
      this.markedDays.push(markedDay)
      console.log("Day to set_ " + day);
    },
    cancelTime () {
      console.log("Time cancelled!")

    },
    async addAvailableDate () {
      const availableDate = {
        yearFrom: this.date[0].getFullYear(),
        monthFrom: this.date[0].getMonth(),
        dayFrom: this.date[0].getDate(),
        hoursFrom: this.date[0].getHours(),
        minutesFrom: this.date[0].getMinutes(),
        yearTo: this.date[1].getFullYear(),
        monthTo: this.date[1].getMonth(),
        dayTo: this.date[1].getDate(),
        hoursTo: this.date[1].getHours(),
        minutesTo: this.date[1].getMinutes()
      }
      const saved = await availableService.addAdditionalOffer(this.provider.id, availableDate);
      console.log("Saved? " + saved);
    },

    // setHighlights () {
    //   addDays(new Date(), 1),
    //   this.filled_days.forEach(fd => {
    //     let filledDay = null;
    //     if (fd.month === new Date().getMonth()) {
    //       filledDay =  addDays(new Date(), 3)         //addDays(new Date(), (fd[0].day   - new Date().getDate()));
    //       this.filled = this.filled.concat(filledDay);
    //     }
    //   })
    // },



    async setTimeMarkers (offer, index) {
      //this.markers = [];
      console.log("KERTA " + offer.id)
      let markedDay = null;
      this.contents = [];
      // markedDay = offer.dayFrom - new Date().getDate()
      // DODO need to add year funcionality
      if (offer.monthFrom === new Date().getMonth()) {
        markedDay = addDays(new Date(), offer.dayFrom - new Date().getDate());
      } else {
        markedDay = addDays(
            new Date(offer.yearFrom, offer.monthFrom, 0), offer.dayFrom);
      }

      console.log("MAKKED DAY " + markedDay.getDate())

      console.log("Test markers: " + new Date(offer.yearFrom, offer.monthFrom, offer.dayFrom, offer.hoursFrom, offer.minutesFrom))
      let i;

      const mDate = new Date(offer.yearFrom, offer.monthFrom, offer.dayFrom, offer.hoursFrom, offer.minutesFrom);
      const lastDate = new Date(offer.yearTo, offer.monthTo, offer.dayTo, offer.hoursTo, offer.minutesTo);

      const startHours = offer.hoursFrom >= 10 ? offer.hoursFrom : "0" + offer.hoursFrom;
      const endHours = offer.hoursTo >= 10 ? offer.hoursTo : "0" + offer.hoursTo;
      const startMinutes = offer.minutesFrom >= 10 ? offer.minutesFrom : "0" + offer.minutesFrom;
      const endMinutes = offer.minutesTo >= 10 ? offer.minutesTo : "0" + offer.minutesTo;
      let timeContent = startHours + " : " + startMinutes + " - " + endHours + " : " + endMinutes;

      let content = {text: timeContent, index: index, timeId: offer.id, date: mDate,  color: 'red'};


      this.contents.push({text: timeContent, index: index, timeId: offer.id, color: 'red'})

      let mContent = {text: timeContent, index: index, timeId: offer.id, color: 'red'}

      console.log("Marker added " + offer.id)
      if (this.markers)
      if (lastDate >= new Date()) {
        this.markers = this.markers.concat({
          dFrom: offer.dayFrom,
          date: markedDay,
          type: 'line',
          color: 'orange',
          content: content
        })
      } else {
        await availableService.removeTimeOffer(this.provider.id, offer.id);
      }

      console.log("Time pikkus " + this.times.length)
      this.times.forEach((time, index) => {

      })

    },
    async providerData () {
      //console.log("User id in provider panel: " + this.userId)
      const provider = await providerService.getProvider(this.userId);

      if (provider) {
        this.provider = provider;

        this.creditLeft = ((provider.proTime - new Date().getTime()) / 86400000).toFixed() < 0 ? 0 : ((provider.proTime - new Date().getTime()) / 86400000).toFixed();
        // provider.reference.forEach((item, id) => {
        //   this.proImages = [
        //       ...this.proImages,
        //     {
        //       id: id,
        //       size: '1400-933',
        //       src: require(`/server/uploads/pro/${item.name}`),
        //       thumb: require(`/server/uploads/pro/${item.name}`),
        //       subHtml: `<div class="lightGallery-captions">
        //
        //
        //   </div>"`
        //     }
        //   ]
        // })

        this.providerTimes = provider.timeoffer;

        if (!provider.isAvailable24_7) {
          this.isProviderCalendar = true;
        }
        //console.log("Provider rooms are: " + provider.room.map(pr => pr));
        this.rooms = provider.room;

        // this.un = provider.user.username;
        // this.ri = provider.yritys;
      }

      //this.confirmedBookings = provider.booking.filter(booking => booking.status === "confirmed")


      this.times = []
      if (this.providerTimes) {

        this.providerTimes.forEach(offer => {

          this.initializeTime(offer);
        })



        this.providerTimes.forEach((offer, index) => {
          this.setTimeMarkers(offer, index);
        })
      }

      //this.removeExpiredDateTime();

      console.log("Provider times pikkus " + this.providerTimes.length)
      console.log("Markerite pikkus " + this.markers.length)

      //}


    },
    createFilledTimes () {
      let time_data = {};
      this.filled_days.forEach(fd => {
        time_data = {
          day: fd.day,
          time: fd,

        }
      })
    },

    initializeTime (offer) {
      let time = []
      const compareDate = new Date(offer.yearFrom, offer.monthFrom, offer.dayFrom, offer.hoursFrom, offer.minutesFrom);
      time.push(
          {
            day: offer.dayFrom,
            hours: offer.hoursFrom,
            minutes: offer.minutesFrom
          },
          {
            day: offer.dayTo,
            hours: offer.hoursTo,
            minutes: offer.minutesTo
          }

      )
      if (compareDate >= new Date()) {
        this.times.push(time)
      }


    },

    test (index) {
      console.log("What ever: " + index);
      /*lang="scss"*/
    },
  },

}
// lang="scss"
</script>

<style >
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lightgallery.css");*/
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-zoom.css");*/
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-video.css");*/

.icon {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #86bb71;
  margin-left: 20px;
  display: inline-block;
}
.proPanelTable {
  position: relative; color: #ddd; font-size: 14px; text-align: left;
}
.proPanelHeader {
  padding: 50px 30px 50px 30px;
  text-align: left;
}

.ratingData {
  font-size: 11px;
  color: darkgrey;
  float: right;
}


@media only screen and (max-width: 500px) {
  .hide {
    display: none !important;
  }
  .proPanelTable {
    position: relative; color: #ddd; font-size: 11px; text-align: left;
  }
  .ratingData {
    font-size: 7px;
    color: darkgrey;
    float: right;
  }
}



.center {
  margin: auto;
  width: 25%;

  padding: 7px;
}

/*.info {*/


/*  color: white;*/
/*  background: lightblue;*/
/*  font-size: 20px;*/
/*  border: solid #35bbc7;*/
/*  border-radius: 5px;*/
/*  margin-left: 20px;*/

/*  margin-bottom: 10px;*/
/*}*/

.action-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.file-marker > div {
  padding: 0 3px;
  /*height: 130px;*/
  /*margin-top: -0.8em;*/
  margin-top: -1em;
}
.box-title {
  background: #141414 none repeat scroll 0 0;
  color: palevioletred;
  display: inline-block;
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
#info-block section {
  border: 1px solid #a0dde0;
  margin-bottom: 20px;
}
.datepicker_opacity {
  opacity: 0.5;
}






#wrapper{position:relative; height:40px; width:100%;}
/*#wrapper p{position:absolute;  top:0;left:0; display:block; white-space:nowrap}*/
</style>