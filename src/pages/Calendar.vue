<template>
  <div style="padding-top: 25px;">
    <MDBContainer>
      <MDBRow>
        <MDBCol style=" " md="6" >
          <div v-if="userIsProvider">
            <VueDatePicker
                dark
                style="width: 100%; justify-content: center;"

                @internal-model-change="handleInternal"

                @overlay-toggle="onOverlayToggle"

                range auto-range="0"
                v-model="date"
                @update:model-value="handleDate"
                inline
                locale="fi" selectText="Valitse"
                :min-date="new Date()"
                :markers="markers"
                :highlight="filled.concat(client_filled)"

                :teleport="true"
                :month-change-on-scroll="false"


                ref="datepicker"
                :key="pickerKey"

            >

            </VueDatePicker>

          </div>
          <div v-else>
            <vue-date-picker
                dark
                inline auto-apply
                locale="fi"
                :highlight="filled.concat(client_filled)"

                :teleport="true"
                :month-change-on-scroll="false"

                range auto-range="0"
                :min-date="new Date()"
                ref="datepicker"
                :key="pickerKey"

                v-model="date"
                @internal-model-change="handleInternal"
                :enable-time-picker="false"
            />
          </div>
        </MDBCol>
        <MDBCol  md="6"  style="position: relative;">
          <div class="calendar-info">
            <h4 v-if="dateToDisplay">
              {{dateToDisplay}}
            </h4>
            <div v-if="calendarContents.length > 0"  style="padding-bottom: 20px; padding-top: 20px;margin-bottom: 10px;">

<!--              <MDBListGroup >-->
<!--                <MDBListGroupItem color="dark">-->
<!--                  123-->
<!--                </MDBListGroupItem>-->
<!--              </MDBListGroup>-->


              <div v-for="(item, index) in calendarContents" :key=" index">

                <MDBTable dark striped  borderless style="margin-right: 2px; font-size: 14px; color: #ddd; text-align: left;" >

                  <tbody >
                  <tr v-if="item.type === 'marker'" style="border-left: 4px solid orange;">

                    <td >
                      {{item.content_time}}

                    </td>
                    <td>
                      <div style="">
                        <VueDatePicker dark teleport-center  v-model="times[item.content_index]"  time-picker range @update:model-value="handleTime">
                          <template #trigger>
                            <MDBIcon class="clickable-text" @click="onEdit(item.content_timeId, item.content_index)">
                              <i class="fas fa-edit" size="lg" style="cursor: pointer"></i>
                            </MDBIcon>
                          </template>
                        </VueDatePicker>
                      </div>


                    </td>

                    <td>
                      <MDBBtnClose white @click="delTimeRange(item.content_timeId, item.content_index)"/>

                    </td>

                  </tr>
                  <tr v-if="item.type === 'highlight'" class="table-dark">

                    <td style="border-left: 4px solid #35BBC7FF; color: cadetblue">
                      {{item.hours >= 10 ? item.hours : "0" + item.hours}} :
                      {{item.minutes >= 10 ? item.minutes : "0" + item.minutes}}
                    </td>
                    <td colspan="4">
                      <MDBBtn v-if=" dayPanelIndex === null || dayPanelIndex !== item.index" block color="dark" @click="openTask(item.index)">
                        Ava
                      </MDBBtn>

                      <MDBBtn v-else block color="dark" @click="closeTask(item.index)">
                        Sulje
                      </MDBBtn>
                    </td>


                  </tr>

                  <tr v-if="item.type === 'highlight' && dayPanelIndex === item.index" class="table-dark">

                    <td colspan="5  ">
                      <div  class="flex flex-wrap align-items-center justify-content-center">
                        <div  class="scalein animation-duration-3000 animation-iteration flex align-items-center justify-content-center
                        font-bold   w-full">
                          <div v-if="item.state === 'pro'">
                            <info
                                v-if="item.booking.onTime[0].day === item.day"
                                style="width: 100%;"
                                :index = item.index
                                status = "for-provider"
                                :msg = item.booking
                                :content = item.booking
                                :provider = provider
                                @remove:proConfirmed = handleRemoveProConfirmed
                            />
                          </div>
                          <div v-else>
                            <info
                                v-if="item.booking.onTime[0].day === item.day"
                                style="width: 100%;"
                                :index = item.index
                                status = "for-recipient"
                                :msg = item.booking
                                :content = item.booking
                                :provider = provider
                                @remove:proConfirmed = handleRemoveProConfirmed
                            />
                          </div>

                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </MDBTable>

              </div>


            </div>
            <div v-else>
              <h4 class="middle">EI MERKINTOJA</h4>
            </div>
          </div>











<!--          <div class="calendar-info">-->

<!--            <h4 v-if="dateToDisplay">-->
<!--              {{dateToDisplay}}-->
<!--            </h4>-->

<!--            <div v-if="dayMarkerData.length > 0"  style="padding-bottom: 20px; padding-top: 20px;margin-bottom: 10px;">-->
<!--              <div v-for="(item, i) in dayMarkerData" :key=" i">-->

<!--                <MDBTable dark striped  borderless style="margin-right: 2px; font-size: 14px; color: #ddd; text-align: left;" >-->

<!--                  <tbody >-->
<!--                  <tr style="border-left: 3px solid orange;"  v-for="(time, index) in item.time" :key="index">-->

<!--                    <td >-->
<!--                      {{time.text}}-->

<!--                    </td>-->
<!--                    <td>-->
<!--                      <div style="">-->
<!--                        <VueDatePicker dark  v-model="times[time.index]"  time-picker range @update:model-value="handleTime">-->
<!--                          <template #trigger>-->
<!--                            <MDBIcon class="clickable-text" @click="onEdit(time.timeId, time.index)">-->
<!--                              <i class="fas fa-edit" size="lg" style="cursor: pointer"></i>-->
<!--                            </MDBIcon>-->
<!--                          </template>-->
<!--                        </VueDatePicker>-->
<!--                      </div>-->


<!--                    </td>-->

<!--                    <td>-->
<!--                      <MDBBtnClose white @click="delTimeRange(time.timeId, time.index)"/>-->

<!--                    </td>-->

<!--                  </tr>-->
<!--                  <tr v-if="item.type === 'highlight'" class="table-dark">-->

<!--                    <td style="border-left: 3px solid #35BBC7FF;">-->
<!--                      {{item.hours >= 10 ? item.hours : "0" + item.hours}} :-->
<!--                      {{item.minutes >= 10 ? item.minutes : "0" + item.minutes}}-->
<!--                    </td>-->
<!--                    <td colspan="4">-->
<!--                      <MDBBtn v-if=" dayPanelIndex === null || dayPanelIndex !== i" block color="dark" @click="openTask(i)">-->
<!--                        Ava-->
<!--                      </MDBBtn>-->

<!--                      <MDBBtn v-else block color="dark" @click="closeTask(i)">-->
<!--                        Sulje-->
<!--                      </MDBBtn>-->
<!--                    </td>-->


<!--                  </tr>-->

<!--                  <tr v-if="item.type === 'highlight' && dayPanelIndex === i" class="table-dark">-->

<!--                    <td colspan="5  ">-->
<!--                      <div  class="flex flex-wrap align-items-center justify-content-center">-->
<!--                        <div v-for="(booking, num) in item.booking" :key="num" class="scalein animation-duration-3000 animation-iteration flex align-items-center justify-content-center-->
<!--                        font-bold   w-full">-->
<!--                          <div v-if="booking.state === 'pro'">-->
<!--                            <info-->
<!--                                v-if="booking.onTime[0].day === item.day && dayPanelIndex === i"-->
<!--                                style="width: 100%;"-->
<!--                                :index = i-->
<!--                                status = "for-provider"-->
<!--                                :msg = booking[i]-->
<!--                                :content = booking-->
<!--                                :provider = provider-->
<!--                                @remove:proConfirmed = handleRemoveProConfirmed-->
<!--                            />-->
<!--                          </div>-->
<!--                          <div v-else>-->
<!--                            <info-->
<!--                                v-if="booking.onTime[0].day === item.day && dayPanelIndex === i"-->
<!--                                style="width: 100%;"-->
<!--                                :index = i-->
<!--                                status = "for-recipient"-->
<!--                                :msg = booking[i]-->
<!--                                :content = booking-->
<!--                                :provider = provider-->
<!--                                @remove:proConfirmed = handleRemoveProConfirmed-->
<!--                            />-->
<!--                          </div>-->

<!--                        </div>-->
<!--                      </div>-->
<!--                    </td>-->
<!--                  </tr>-->
<!--                  </tbody>-->
<!--                </MDBTable>-->

<!--              </div>-->


<!--            </div>-->
<!--            <div v-else>-->
<!--              <h4 class="middle">EI MERKINTOJA</h4>-->
<!--            </div>-->
<!--          </div>-->
        </MDBCol>
      </MDBRow>

<!--      client filled days Calendar {{client_filled_days}}<br>-->
<!--      pro filled {{filled}}-->
<!--      pro filled days {{filled_days}}-->
<!--      client container {{clientFilledContainer}}<br><br>-->
<!--      pro filled container {{proFilledContainer}}-->
<!--      bookings {{bookings}}-->
<!--      client f {{client_filled}}-->

<!--      DayPanelIndex {{dayPanelIndex}}<br>-->
<!--      dayPanelData length {{dayMarkerData.length}}<br>-->
<!--      dayPanelData {{dayMarkerData}}-->
<!--      calendar contents {{calendarContents}}-->
    </MDBContainer>
  </div>

</template>

<script>
/* eslint-disable */
import {
  MDBContainer, MDBRow, MDBCol, MDBTable, MDBIcon, MDBBtn, MDBBtnClose, MDBListGroup, MDBListGroupItem
} from 'mdb-vue-ui-kit';
import VueDatePicker from '@vuepic/vue-datepicker';

import info from '../components/CompletedBookingPanel'
import { ref } from 'vue';
//import df from '../components/controllers/formatDate'
import '@/css/style.css';
import '@/css/notification.css'
import addDays from "date-fns/addDays";
import availableService from "@/service/calendarOffers";
import providerService from "@/service/providers";
export default {
  name: "Calendar",
  props: {
    userIsProvider: Object,
    bookings: Array,
    filled_days: Array,
    filled: Array,
    bookingsConfirmed: Array,

    client_filled_days: Array,
    client_filled: Array,
    confirmedBookingsByProvider: Array
  },
  components: {
    VueDatePicker,
    info,
    //df,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBTable,
    MDBIcon,
    MDBBtn,
    MDBBtnClose,
    MDBListGroup,
    MDBListGroupItem
  },
  data () {
    const date = ref()
    const datepicker = ref(null)
    const pickerKey = ref(null)
    const openCalendar = () => {
      datepicker.value.toggleMenu();
    };
    return {
      open: false,
      unitedFilledDays: this.filled.concat(this.client_filled),
      date,
      datepicker,
      pickerKey,
      openCalendar,
      provider: {},
      providerTimes: [],
      times: [],
      dayMarkerData: [],
      calendarContents: [],
      editedMarkerID: null,
      editedMarkerIndex: null,
      dayPanelIndex: null,
      userId: null,
      dateToDisplay: null,
      markers: [],
      isHandleInternal: false,
      clientFilledContainer: [],
      proFilledContainer: []
      //d_f: df
    }
  },
  beforeMount () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (!loggedUserJSON) {
      this.$router.push('/');
    } else {
      const user = JSON.parse(loggedUserJSON)
      this.userId = user.id
      console.log("User token in provider: " + user.token)

      this.providerData();
    }
  },
  mounted ()  {
    //this.dateToDisplay = this.fDateString(new Date());
    if (this.datepicker) {
      console.log("Yes it is datepicker instance...")
      // Close the menu programmatically
      this.datepicker.openMenu()
    }
  },
  methods: {
    onOverlayToggle(overlay) {
      console.log(`Overlay ${overlay.overlay} is ${overlay.open ? 'opened' : 'closed'}`);
    },
    fDateString (date) {
      const month = [];
      month[0]="Tammikuu";
      month[1]="Helmikuu";
      month[2]="Maaliskuu";
      month[3]="Huhtikuu";
      month[4]="Toukokuu";
      month[5]="Kesäkuu";
      month[6]="Heinäkuu";
      month[7]="Elokuu";
      month[8]="Syyskuu";
      month[9]="Lokakuu";
      month[10]="Marraskuu";
      month[11]="Joulukuu";

      const fDate = new Date(date);

      return  month[new Date(date).getMonth()] + " " + fDate.getDate() + " / " + fDate.getFullYear();
    },
    checkClientFilled (day) {
      this.clientFilledContainer = [];
      if (this.client_filled_days) {
        this.client_filled_days.forEach((cf, i) => {
          if (day === cf.day) {
            console.log("On see päev " + day)
            //this.isTimeToEdit = true;
            this.clientFilledContainer.push({
              type: "highlight",
              state: "client",
              day: day,
              content_date: new Date(cf.year, cf.month, cf.day, cf.hours, cf.minutes),
              hours: cf.hours,
              minutes: cf.minutes,
              index: i,
              //booking: this.confirmedBookingsByProvider.filter(bc => bc.onTime[0].day === day),
              booking: this.confirmedBookingsByProvider[i]
            });

          } else {
            console.log("Ei ole client day")
          }

        })
      }else {
        console.log("Client filled days array is empty!")
      }

    },
    checkProFilled (day) {
      this.proFilledContainer = [];
      if (this.filled_days) {
        this.filled_days.forEach((pf, i) => {
          if (day === pf.day) {
            console.log("On see päev " + day)
            //this.isTimeToEdit = true;
            this.proFilledContainer.push({
              type: "highlight",
              state: "pro",
              day: day,
              content_date: new Date(pf.year, pf.month, pf.day, pf.hours, pf.minutes),
              hours: pf.hours,
              minutes: pf.minutes,
              index: i,
              //booking: this.confirmedBookingsByProvider.filter(bc => bc.onTime[0].day === day),
              // xxx: this.bookings[i].header,
              booking: this.bookingsConfirmed[i]
            });

          } else {
            console.log("Ei ole pro day")
          }

        })
      }else {
        console.log("Client filled days array is empty!")
      }
    },
    handleInternal (date) {

      // if (date) {
      //   this.pickerKey = null; // Force Vue to re-render the picker
      // }
      console.log("Pickerkey ---- " + this.pickerKey)


      this.dayMarkerData = [];
      let filledContainer = [];
      let markerContainer = [];
      let markerContents = [];

      if (date) {
        this.isHandleInternal = true;
        // console.log("DATE" + date[0].getDate())
        // console.log("date format: " + this.fDateString(date[0]))
        this.dateToDisplay = this.fDateString(date[0]);

        const weekDay = date.toString().substring(0, 3)
        const day = date[0].getDate();
        const month = date[0].getMonth();
        let time = {}
        let content = {}

        console.log("length xxxxxxxx " + this.markers.length)

        this.filled_days.forEach(f => {
          if (day === f.day) {
            console.log("On see päev " + day)
            //this.isTimeToEdit = true;
            filledContainer.push({
              type: "highlight",
              state: "pro",
              day: day,
              weekDay: weekDay,
              hours: f.hours,
              minutes: f.minutes,
              booking: this.bookingsConfirmed.filter(bc => bc.onTime[0].day === day)
            });

          } else {
            console.log("Ei ole")
          }

        })

        this.checkClientFilled(day);
        this.checkProFilled(day)
        let isCompared = false;
        const markerType = ""

        let marker_contents = [];

        const markerContents = [];
        this.markers.forEach(m => {
          if (m.date.getDate() === day) {
            isCompared = true;

            console.log("IS COMPARED " + isCompared)
            //this.isTimeToEdit = true
            time = {
              type: "marker",
              day: day,
              weekDay: weekDay,
              time: m.content
            }
            markerContents.push(m.content);
            markerContainer.push(time)

            marker_contents = [
                ...marker_contents,
              {
                type: "marker",
                day: day,
                content_time: m.content.text,
                content_index: m.content.index,
                content_timeId: m.content.timeId,
                content_date: m.content.date
              }
            ]

            // let content = {text: timeContent, index: index, timeId: offer.id, date: mDate,  color: 'red'};

          }

        })

        if (isCompared) {
          this.dayMarkerData = this.dayMarkerData.concat({
            type: "marker",
            day: day,
            weekday: weekDay,
            time: markerContents

          })

        }

        this.calendarContents = marker_contents.concat(this.clientFilledContainer).concat(this.proFilledContainer);
        this.calendarContents.sort((a, b) =>
            a.content_date - b.content_date

        )

        this.calendarContents.forEach((cc, i) => {
          this.calendarContents[i].ide = i;
        })

        this.times = []
        if (this.providerTimes) {
          this.providerTimes.forEach(offer => {
            this.initializeTime(offer);
          })
        }

        //this.editArr = this.editArr.concat(editarr);
        this.dayMarkerData = this.dayMarkerData.concat(filledContainer).concat(this.clientFilledContainer);


      }

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

    },
    async handleDate (value) {
      console.log("Date handled! " +  value)

      this.clientFilledContainer = [];

      if (value) {
        this.pickerKey++; // Force Vue to re-render the picker
      }
      console.log("Pickerkey ---- " + this.pickerKey)

      const createdDate = {
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




      const savedTimeRange = await availableService.addAdditionalOffer(this.provider.id, createdDate);

      //console.log("Provider times " + this.providerTimes)
      if (savedTimeRange) {
        this.providerTimes = this.providerTimes.concat(savedTimeRange);
      }


      this.times = [];
      this.markers = [];

      this.providerTimes.forEach((times, index) => {
        this.setTimeMarkers(times, index)
        this.initializeTime(times);
      })


      // NB ------------------------------------------------------

      let dayHighlightContents = [];

      let time = {}
      this.editArr = [];
      this.dayMarkerData = [];

      console.log("------------- PT -------- " + this.providerTimes.length);
      console.log("------------- ML  --------- " + this.markers.length);

      this.filled_days.forEach(fd => {
        if (this.date[0].getDate() === fd.day) {
          console.log("On")
          this.isTimeToEdit = true;
          dayHighlightContents.push({
            type: "highlight",
            state: "pro",
            day: this.date[0].getDate(),
            weekDay: "Laupäev",
            hours: fd.hours,
            minutes: fd.minutes,
            booking: this.bookingsConfirmed.filter(bc => bc.onTime[0].day === this.date[0].getDate())
          });

        } else {
          console.log("Ei ole")
        }

      })

      this.checkClientFilled(this.date[0].getDate(), "week");



      let d;

      //TODO siin probleem
      const timeContents = [];
      let marker_contents = [];
      this.markers.forEach(m => {
        if (m.date.getDate() === savedTimeRange.dayFrom) {
          this.isTimeToEdit = true;
          time = {
            day: savedTimeRange.dayFrom,
            weekDay: "Laupäev",
            time: m.content
          }
          timeContents.push(m.content)

          marker_contents = [
            ...marker_contents,
            {
              type: "marker",
              day: savedTimeRange.dayFrom,
              content_time: m.content.text,
              content_index: m.content.index,
              content_timeId: m.content.timeId,
              content_date: m.content.date
            }
          ]

        }

      })

      this.calendarContents = marker_contents.concat(this.clientFilledContainer);
      //this.calendarContents = this.clientFilledContainer.concat(marker_contents);
      this.calendarContents.sort((a, b) =>
          a.content_date - b.content_date

      )

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
      this.dayMarkerData = this.dayMarkerData.concat(dayHighlightContents).concat(this.clientFilledContainer);
      this.dayMarkerData.sort((a, b) => {

      })

      //this.pickerKey = null;

      console.log("Value ----------  " + value[0].getHours());
      // this.$nextTick(() => {
      //   console.log("NextTick....");
      //   this.date = new Date(value); // Ensure reactivity
      // });


      // if (value && typeof value === 'object' && value[0].getHours() !== undefined) {
      //   console.log("Value xxx " + value);
      //   // The time has been selected, so force the calendar view
      //   this.$nextTick(() => {
      //     console.log("NextTick....--...");
      //     this.date = new Date(value); // Ensure reactivity
      //   });
      // }

    },
    handleDateUpdate (value) {
      console.log("Value ----------  " + value[0].getHours());
      this.$nextTick(() => {
        console.log("NextTick....");
        this.date = new Date(value); // Ensure reactivity
      });
      if (value && typeof value === 'object' && value[0].getHours() !== undefined) {
        console.log("Value xxx " + value);
        // The time has been selected, so force the calendar view
        this.$nextTick(() => {
          this.date = new Date(value); // Ensure reactivity
        });
      }
    },
    onEdit (id, index) {
      console.log("Editing time id " + id)
      console.log("Index on " + index)
      this.editedMarkerID = id;
      this.editedMarkerIndex = index;


      //this.isEditTime = true;

    },
    async handleTime (date) {

      this.xxx = date
      console.log("Time is handled " + date[0].hours + " " + date[1].hours )
      console.log("ID NOW HERE" + this.editedMarkerID)

      const offerForEdit = {
        hoursFrom: date[0].hours,
        minutesFrom: date[0].minutes,
        hoursTo: date[1].hours,
        minutesTo: date[1].minutes
      }

      this.times[this.editedMarkerIndex] = [{hours: date[0].hours, minutes: date[0].minutes}, {hours: date[1].hours, minutes: date[1].minutes}];


      const edited = await availableService.updateOffer(this.editedMarkerID, offerForEdit)
      console.log("Offer edited: " + edited)
      this.timeEditSuccessMessage = "Aika muokattu onnistuneesti!";

      setTimeout(() => {
        this.timeEditSuccessMessage = null
      }, 2000)
      this.isTimeToEdit = false;

      this.providerTimes = this.providerTimes.filter(time => time.id !== this.editedMarkerID ? time : edited);

      const startHours = date[0].hours >= 10 ? date[0].hours : "0" + date[0].hours;
      const endHours = date[1].hours >= 10 ? date[1].hours : "0" + date[1].hours;
      const startMinutes = date[0].minutes >= 10 ? date[0].minutes : "0" + date[0].minutes;
      const endMinutes = date[1].minutes >= 10 ? date[1].minutes : "0" + date[1].minutes;
      let newTimeContent = startHours + " : " + startMinutes + " - " + endHours + " : " + endMinutes;

      this.calendarContents.map(item => item.content_timeId === this.editedMarkerID ? item.content_time = newTimeContent : item);

      //this.markers.map(marker => marker.content.timeId === this.editedMarkerID ? marker.content.text = newTimeContent : marker);


    },
    async delTimeRange (rangeId, index) {
      await availableService.removeTimeOffer(this.provider.id, rangeId);

      console.log("Id argumendina? " + rangeId)

      this.times.splice(index, 1);

      this.providerTimes = this.providerTimes.filter(time => time.id !== rangeId);


      this.markers = this.markers.filter(marker => marker.content.timeId !== rangeId);

      console.log("MARKERS LEN " + this.markers.length)
      const highlights = this.dayMarkerData.filter(dpd => dpd.type === "highlight");

      this.dayMarkerData = this.dayMarkerData.filter(dpd => dpd.type === "marker");


      this.calendarContents = this.calendarContents.filter(item => item.content_timeId !== rangeId);



      if (this.dayMarkerData.length > 1) {
        this.dayMarkerData = this.dayMarkerData.filter(item => item.time.some(it => it.timeId !== rangeId))


      } else {
        console.log("Something else!!")
        this.dayMarkerData[0].time = this.dayMarkerData[0].time.filter(item => item.timeId !== rangeId);
      }
      this.dayMarkerData = this.dayMarkerData.concat(highlights);

      if (this.dayMarkerData[0].time.length === 0) {
        //this.isTimeToEdit = false;
        console.log("No times to display!!")
      }
    },

    openTask (index) {
      this.dayPanelIndex = index;
      //this.isHandleTask = true;

      //this.isDisplayConfirmed = true;
      console.log("Index in open - " + index);
    },
    closeTask (index) {
      this.dayPanelIndex = null;
      //this.isHandletask = false;
      //this.isDisplayConfirmed = false;
      console.log("Index in close - " + index);
    },

    async providerData () {
      const provider = await providerService.getProvider(this.userId);

      if (provider) {
        this.provider = provider;

        //this.creditLeft = ((provider.proTime - new Date().getTime()) / 86400000).toFixed() < 0 ? 0 : ((provider.proTime - new Date().getTime()) / 86400000).toFixed();

        this.providerTimes = provider.timeoffer;
      }

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
    // lang="scss"
    },
  }
}
</script>

<style >
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lightgallery.css");*/
/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-zoom.css");*/


/*@import url("https://cdn.jsdelivr.net/npm/lightgallery@2.0.0-beta.4/css/lg-video.css");*/



:root {
  --text-color: #9cebeb;
  --dp-cell-size: 95px;
  --dp-cell-padding: 13px;
  --dp-month-year-row-button-size: 45px;
  --dp-button-icon-height: 30px;
  --dp-font-size: 1.9rem;

}

.dp__theme_dark {
  --dp-background-color: #212121;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  /*--dp-primary-color: #b24d00;*/
  --dp-primary-color: grey;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  /*--dp-marker-color: #e53935;*/
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  /*--dp-highlight-color: rgb(64, 64, 39);*/
  /*--dp-highlight-color: rgb(102, 170, 177);*/
  --dp-highlight-color: steelblue;
  --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
  --dp-range-between-border-color: var(--dp-hover-color, #fff);
}
.calendar-size {
  margin-bottom: 50px;
  justify-content: left;
}
.calendar-info {
  background-color: #2e2b2b;
  width: 100%;
  height: 500px;
  overflow-y: scroll;

  padding: 13px;
}
@media only screen and (max-width: 1400px) {
  :root {
    --text-color: #9cebeb;
    --dp-cell-size: 82px;
    --dp-cell-padding: 9px;
    --dp-month-year-row-button-size: 41px;
    --dp-button-icon-height: 30px;
    --dp-font-size: 1.7rem;

  }
  .calendar-size {
    margin-bottom: 50px;
    justify-content: center;
  }
}
@media only screen and (max-width: 1200px) {
  :root {
    --text-color: #9cebeb;
    --dp-cell-size: 68px;
    --dp-cell-padding: 9px;
    --dp-month-year-row-button-size: 45px;
    --dp-button-icon-height: 30px;
    --dp-font-size: 1.6rem;

  }
}
@media only screen and (max-width: 1000px) {
  :root {
    --text-color: #9cebeb;
    --dp-cell-size: 47px;
    --dp-cell-padding: 7px;
    --dp-month-year-row-button-size: 41px;
    --dp-button-icon-height: 30px;
    --dp-font-size: 1.3rem;

  }
  .calendar-size {
    margin-bottom: 50px;
    /*justify-content: center;*/
  }
  .calendar-info {
    background-color: #2e2b2b;
    width: 100%;
    height: 500px;
    overflow-y: scroll;

    padding: 13px;
  }
}

@media only screen and (max-width: 800px) {
  :root {
    --text-color: #9cebeb;
    --dp-cell-size: 47px;
    --dp-cell-padding: 7px;
    --dp-month-year-row-button-size: 41px;
    --dp-button-icon-height: 30px;
    --dp-font-size: 1.3rem;

  }

}
@media only screen and (max-width: 500px) {

  :root {
    --text-color: #9cebeb;
    --dp-cell-size: 50px;
    --dp-cell-padding: 5px;
    --dp-month-year-row-button-size: 35px;
    --dp-font-size: 1.2rem;
    /*--dp-highlight-color: rgb(245, 131, 156);*/
  }
  .calendar-info {
    background-color: #2e2b2b;
    width: 100%;
    height: 400px;
    overflow-y: scroll;

    /*padding: 13px;*/
  }
}


.middle {
  color: #969595;
  position : absolute;
  width    : 200px;
  height   : 100px;
  left     : 50%;
  top      : 50%;
  margin-left : -100px; /* half of the width  */
  margin-top  : -100px; /* half of the height */
}
.center-block {
  top:50%;
  left: 50%;
  transform: translate3d(-50%,-50%, 0);
  position: absolute;
}
</style>