<template>

  <div >
<!--    position: relative;-->
    <MDBContainer style="padding-top: 47px; ">
<!--      <div style="text-align: left; margin-bottom: 17px;">-->
<!--        <img src="../assets/left_back.png" alt="back" @click="back"/>-->
<!--      </div>-->

      <errorNotification :message="proSelectError" />
      <errorNotification :message="mapError" />
      <div class="client-form">
        <p style="margin-top: 10px;">{{t('receiver_form_offersOrQuickSolution')}}</p>
        <form class="g-3 needs-validation" novalidate @submit.prevent="checkForm" autocomplete="off" style=" padding: 5px;">
          <MDBRow>

            <MDBCol col="8">
              <div style=" margin-bottom: 20px; background-color: #1F3D40FF;" >
                <Dropdown   v-model="professional"  :options="prodata"   filter optionLabel="label" optionGroupLabel="label"  optionGroupChildren="items" :placeholder="t('receiver_form_getProfessional')" v-bind:style="isNoPro ? 'color: pink; border: 1px solid red;' : 'color: white;'" class="w-full md:w-100rem">

                  <template value="slotProps">
                    <div v-if="slotProps.value" >
                      <!--              <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />-->

                      <div>{{ slotProps.value.label }}</div>
                    </div>
                    <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                  </template>
                  <template #optiongroup="slotProps" >
                    <div  class="flex align-items-center">
                      <!--              <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />-->
                      <i :class= 'slotProps.option.icon' style='font-size:17px;color:cadetblue;'></i>&nbsp;&nbsp;&nbsp;
                      <div>{{ slotProps.option.label }}</div>
                    </div>
                  </template>
                </Dropdown>
              </div>
            </MDBCol>

            <MDBCol col="4">
              <div>
                <img style="width: 50px; cursor: pointer;" :src="require(`@/assets/map.gif`)" alt="from_map" @click="this.$router.push('/recipient-public')"/>

              </div>

            </MDBCol>
          </MDBRow>


          <MDBInput
              counter :maxlength="30"
              :label="t('receiver_form_enterOrderKeyword')"
              v-model="header"

              size="lg"
              white
              invalidFeedback="Ole hyvä ja kirjoita otsikko."
              validFeedback="Ok!"
              required
              wrapperClass="mb-4"
          >
          </MDBInput>

          <MDBRow>
            <MDBCol lg="6">
              <MDBInput
                  inputGroup
                  :label="address ? 'Anna toinen osoitteesi' : 'Anna osoite'"
                  white
                  v-model="address"
                  id="osoite"
                  size="lg"
                  invalidFeedback="Ole hyvä ja kirjoita osoite."
                  validFeedback="Ok!"
                  required
                  wrapperClass="mb-4"
              >
                <MDBBtnClose v-if="address" white style="margin-right: 7px; margin-top: 5px;" @click="clearAddress"/>

              </MDBInput>
            </MDBCol>
            <MDBCol lg="6">
              <div style="margin-bottom: 13px;">
<!--                <label for="Range"></label>-->
<!--                <input id="Range" >-->

                <MDBInput
                    white
                    :label="t('receiver_form_selectDesiredRegion')"
                    type="number"
                    onkeypress="return event.charCode >= 48" min="0"
                    v-model="range"
                >

                </MDBInput>


              </div>
            </MDBCol>

          </MDBRow>
          <div >


          </div>

<!--          auto-position="top"-->

          <p style="text-align: left;">{{t('receiver_form_whenProNeeded')}}</p>

          <div style="color: #fff;">
            <VueDatePicker
                style="margin-bottom: 20px;"
                v-model="date"
                dark
                :min-date="new Date()"
                teleport-center
                @internal-model-change="handleInternalDate"
                :state="isNoDate ? false : null"

            >

            </VueDatePicker>
          </div>

          <div style="text-align: left;">
            <MDBCheckbox
                white
                label="Vastaukset voi lähettää sähköpostiin!"
                name="agreement_as_client"
                v-model="isClientContactAgreement"
                value="true"
                wrapperClass="mb-4"
            />
          </div>

          <MDBRow>
            <MDBCol lg="6">
              <MDBTextarea
                  maxlength="70"
                  :label="t('receiver_form_orderContentsDescription')"
                  white
                  rows="3"

                  v-model="explanation"
                  invalidFeedback="Ole hyvä ja kirjoita tehtävän kuvaus."
                  validFeedback="Ok!"
                  required
              />
              <span class="message-counter">{{ explanation.length }} / 70</span>
            </MDBCol>
            <MDBCol lg="6">
              <error-notification :message = imgLoadErrorMessage />
              <img v-if="showImage" :src="showImage" style="width: 200px; margin-bottom: 20px;" alt="..."/>
              <label v-if="!isUploaded" for="file-upload" class="custom-file-upload">

                <span v-if="value">
                    {{t('receiver_form_orderContentImageEdit')}} {{value.name}}

                </span>
                <span v-else>{{t('receiver_form_orderContentImage')}}</span>

              </label>

              <input id="file-upload" type="file" @change="handleFileChange"/>

              <MDBBtn v-if="isImageSelected" outline="danger" size="lg" block @click="removeFile">Poista valitsettu kuva</MDBBtn>
              <MDBBtn v-if="isImageSelected"
                      outline="success"
                      size="lg"
                      block
                      style="margin-bottom: 10px;"
                      @click="uploadImage">Lataa valitsettu kuva</MDBBtn>

            </MDBCol>


          </MDBRow>

          <MDBBtn outline="success" size="lg"  @click="addRecipient" style="margin-top:5px; margin-bottom: 20px;" type="submit">{{t('receiver_form_createAnOrder')}}</MDBBtn>

        </form>
      </div>


    </MDBContainer>

  </div>

</template>

<script>
/* eslint-disable */
/* global google */
//const fs = require('fs');

import VueDatePicker from '@vuepic/vue-datepicker';
import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBRow,
  MDBCol,
  MDBTextarea,
  MDBBtnClose,
  MDBIcon
} from "mdb-vue-ui-kit";
import recipientService from '../service/recipients'
import uploadService from '../service/image'
import awsUploadService from '../service/awsUploads'
import proData from '@/components/profession/proList'
import {ModelListSelect} from 'vue-search-select'
import errorNotification from '../components/notifications/errorMessage'

import Dropdown from 'primevue/dropdown';
import '@/css/style.css';
import '@/css/notification.css'
import '@/css/pro.css';

//import ImageSelect from '../components/ImageSelect.vue'
import { format } from 'date-fns'
import {ref} from "vue";
import axios from "axios";
import providerService from "@/service/providers";
import {useI18n} from "vue-i18n/dist/vue-i18n";
//import {Client} from "@googlemaps/google-maps-services-js";


//import mapService from '../service/map'



export default {
  name: "recipient-form",
  props: {
    recipientBookings: Array
  },
  components: {
    MDBBtn,
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBRow,
    MDBCol,
    MDBTextarea,
    MDBBtnClose,
    MDBIcon,
    //ImageSelect,
    errorNotification,
    VueDatePicker,
    Dropdown,

    ModelListSelect
  },
  data () {
    const { t } = useI18n();
    const errorColor = ref('red')
    return {
      isClientContactAgreement: false,
      pressedOnAddRecipientBtn: false,
      errorColor,
      t,
      recipientId: null,
      header: "",
      address: null,
      range: null,
      proSelectError: null,
      mapError: null,
      exicting_address: this.recipientBookings.length > 0 ? this.recipientBookings[0].address : "",
      lat: null,
      lng: null,
      isNoDate: false,
      professional: null,
      addFile: null,
      dateTest: null,
      calendarTooltips: [],
      value: null,
      imgLoadErrorMessage: null,
      aaa: "",
      file: null,
      f: null,
      prodata: proData,

      item: "",
      hospitals: [


        {id: "1", hospital_name: "aaaaaaaaaaa"},
        {id: "2", hospital_name: "bbbbbbbbbbbb"},
        {id: "3", hospital_name: `<div style="padding: 4px; background: green; border-radius: 0.25rem; color: white;">Foo</div>` }
      ],

      selectedCountry: "",
      countries: this.proData,
      // countries: [
      //   { name: 'Australia', code: 'AU' },
      //   { name: 'Brazil', code: 'BR' },
      //   { name: 'China', code: 'CN' },
      //   { name: 'Egypt', code: 'EG' },
      //   { name: 'France', code: 'FR' },
      //   { name: 'Germany', code: 'DE' },
      //   { name: 'India', code: 'IN' },
      //   { name: 'Japan', code: 'JP' },
      //   { name: 'Spain', code: 'ES' },
      //   { name: 'United States', code: 'US' }
      // ]

    }
  },

  setup () {
    const date = ref(null)
    const explanation = ref("")
    const isImageSelected = ref(false)
    const imgId = ref(null)
    const showImage = ref(null)
    const isShowImage = ref(false)
    const isUploaded = ref(false)
    const isNotSelected = ref(false)
    const search5 = ref('');
    const createdImageToDisplay = ref(null)
    const _image = ref(null)

    return {
      date,
      explanation,
      createdImageToDisplay,
      _image,
      isImageSelected,
      imgId,
      showImage,
      isShowImage,
      isUploaded,
      isNotSelected,
      search5
    }
  },


  async mounted () {



    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.recipientId = user.id
      //console.log("User token: " + this.loggedUser.token)
      console.log("User id in recipient: " + user.id)
    } else {
      this.$router.push('dash-board');
    }

    await this.myCurrentLocation();

    const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const input = document.getElementById("osoite");
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "fi" },
      fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
      strictBounds: false,
      //types: ["establishment"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    // const autocomplete = client.places.autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.lat = place.geometry.location.lat()
      this.lng = place.geometry.location.lng()

      this.address = place.formatted_address
      console.log(place)
    })
  },

  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    isNoPro() {
      return this.professional === null && this.pressedOnAddRecipientBtn;
    }

  },

  methods: {
    // back () {
    //   if (this.$router.go(-1) !== "login-register") {
    //     this.$router.go(-1);
    //   } else {
    //     this.$router.push('dash-board');
    //   }
    //
    // },
    clearAddress () {
      this.address = "";
    },
    showAlert () {
      alert(this.search5);
    },
    async myCurrentLocation () {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          // Show a map centered at latitude / longitude.
          this.lat = latitude
          this.lng = longitude
          this.showMyLocationData (latitude, longitude)
        });
      }

    },
    showMyLocationData (lat, long) {
      // 'AIzaSyDt2YXE5tk0J72JgqnH3DTD7MeoqbbWBmU'
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +
          "," + long
          + "&key=" + process.env.VUE_APP_MAP_KEY)
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message;

              console.log(response.data.error_message)
            } else {
              // const map = new google.maps.Map(document.getElementById("map"), {
              //   zoom: 13,
              //   center: new google.maps.LatLng(lat, long),
              //   mapTypeId: google.maps.MapTypeId.ROADMAP
              // });

              // AIzaSyBDA2EBoGezJx51wQtxoW3Ecq5Ql8CCAiE

              // new google.maps.Marker({
              //   position: new google.maps.LatLng(lat, long),
              //   accuracy: 50,
              //   map: map,
              //   icon: this.pinSymbol('yellow'),
              //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
              // })

              this.address = response.data.results[1].formatted_address;
              console.log("Address now " + this.address);
            }

          })
          .catch(error => {
            this.error = error.message
            console.log(error.message)
          })
    },
    cancelRecipientForm () {
      this.$router.go(-1);

      // this.$router.push('/')
    },
    async findRecipients () {
      const recipients = await recipientService.getOwnBookings(this.recipientId)
      console.log("Recipients " + recipients.length)

    },
    async remFile () {

      await uploadService.remove('644cff805261bf7d9943c5da',  '644cff875261bf7d9943c5dd');
    },
    handleFileChange(e) {
      //this.$emit('input', e.target.client[0])

      try {

        const files = e.target.files[0]
        console.log('event target client ', e.target.files[0])
        if (files) {
          this.showImage = URL.createObjectURL(files)
          this.file = e.target.files[0];
        }

      } catch (err) {
        console.log('Error:', err)
      }

      this.value = e.target.files[0]
      if (e.target.files[0]) {
        this.isImageSelected = true;
      } else {
        this.isImageSelected = false;
      }
    },
    async uploadImage () {
      const data = new FormData();
      data.append('file', this.file, this.file.name)



      const imgType = this.file.type;
      if (imgType === "image/jpeg" || imgType === "image/jpg" || imgType === "image/png" || imgType === "image/gif") {
        if (this.file.size <= 1000000) {
          //const loadedImg = await uploadService.create(data);
          const loadedImg = await awsUploadService.uploadClientImage(data);
          if (loadedImg) {
            this.imgId = loadedImg.id;
            this.file = null;

            this.isImageSelected = false;
            this.isUploaded = true;

            // Display for pro
            this.createdImageToDisplay = {
              _id: loadedImg.id,
              image: loadedImg.imageUrl
            }
            // Display for recipient in moment uploading
            this._image = {
              _id: loadedImg.id,
              key: loadedImg.key,
              blob: this.showImage
            }
          }

          } else {
            this.imgLoadErrorMessage = "Kuvan koko pitäisi olla 1 MB tai vähemmän!";
            setTimeout(() => {
              this.imgLoadErrorMessage = null;
            }, 3000);
          }
        } else {
          this.imgLoadErrorMessage = "Kuvan formaati voi olla ainostaan jpeg, jpg, png tai gif!"
          setTimeout(() => {
            this.imgLoadErrorMessage = null;
          }, 3000);
        }




        //this.$emit("addImageToRecipientBookings", image, this.booking.id)





    },
    removeFile () {
      this.value = null;
      this.isImageSelected = false;
      this.showImage = null;
    },
    formatDate (date = Date) {
      //let date = datee;
      if (!date) {
        return null
      }
      return format(date, 'dd.MM.yyyy, HH:mm');
    },

    backToDashboard () {

    },
    getDate () {
      // date Thu Apr 20 2023 10:27:00 GMT+0300
      console.log("selected date: " + this.date.getDate())
    },
    handleInternalDate () {
      console.log("Handled")
      this.isNoDate = false;
    },

    // New client to the database
    async addRecipient () {
      this.pressedOnAddRecipientBtn = true;
      let recipient;

      if (this.professional) {
        this.isNotSelected = true;
      }
      if (!this.date) {
        this.isNoDate = true;
      }
      if (this.date && this.professional) {
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let day = this.date.getDate();
        let hour = this.date.getHours();
        let minute = this.date.getMinutes();
        const dateForMs = new Date(year, month, day, hour, minute).getTime()
        let recipientLat =
        recipient = {
          created: this.date,
          created_ms: dateForMs,
          header: this.header,
          agreement: this.isClientContactAgreement,
          address: this.address,
          latitude: this.lat,
          longitude: this.lng,
          zone: this.range !== null ? this.range : 0,
          professional: this.professional.label,
          isIncludeOffers: true,
          year: this.date.getFullYear(),
          month: this.date.getMonth(),
          day: this.date.getDate(),
          hours: this.date.getHours(),
          minutes: this.date.getMinutes(),
          description: this.explanation,
          status: "notSeen",
          imageId: this.imgId ? this.imgId : []
        }
      }

      if (this.lat && this.lng) {
        if (this.header && (this.address)  && this.date && this.explanation) {

          if (this.professional) {
            // Add new booking to user

            const booking = await recipientService.addRecipient(this.recipientId, recipient)

            if (booking) {
              this.$emit('booking:update', booking, this._image, this.createdImageToDisplay);
              //this.$emit("addImageToRecipientBookings", this.img, booking.id)

              console.log("Booking--- " + booking);
            }

            this.$router.push('/received')
          } else {
            console.log("Range error!!")
            this.isNoProSelected = true;
            //this.range = null;
            this.proSelectError = "Lisää ammattilainen";
            setTimeout(() => {
              this.proSelectError = null
            }, 2000);
          }

        } else {
          console.log("Something went wrong")
          console.log("Aadress " + this.address)
          console.log("header " + this.header)
          console.log("Explanation " + this.explanation)
          //console.log("Profession " + this.professional.label)
          console.log("Date " + this.date)
        }
      } else {
        this.mapError = "Valitse osoite pudotusvalikosta. Jos pudotusvaliko puuttuu kokonaan, " +
            "tarkista selaimesi sijaintilupa-asetukset!";
        setTimeout(() => {
          this.mapError = null
        }, 3000);
      }


      //const recipientAdded = await recipientService.addRecipient(this.recipientId, recipient)

    },
    checkForm (event=Event) {
      event.target.classList.add("was-validated");
    }
  }
}
</script>

<style >

/*html, body {*/
/*  overflow-y: auto;*/
/*  background-color: #141414;*/
/*  background-image: url('../assets/247.png');*/
/*}*/

.action-row {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 20px;
  width: 100%;
}



input[type="file"] {
  display: none;
}

.custom-file-upload {
  /*width: 100%;*/
  width: 100%;

  color: white;
  background-color: #87958e;
  border: 1px solid #ccc;
  display: inline-block;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 2%;
  cursor: pointer;
}
.dp__theme_dark {
  --dp-icon-color: #fff;
  --dp-border-color: #ddd;

}
.input {
  color: red;
}
.close_btn {
  position: absolute;
  right: 20px;
  top: -30px;
  cursor: pointer;
  font-weight: bold;
}

input[type=search]::-webkit-search-cancel-button {
  -webkit-appearance: searchfield-cancel-button;
}

/*.p-dropdown {*/
/*  border: 1px solid lightgrey;*/
/*  color: #dddddd;*/
/*  text-align: left;*/
/*  padding: 7px;*/
/*  cursor: pointer;*/

/*}*/


/*!*.p-dropdown-label {*!*/
/*!*  *!*/
/*!*}*!*/

/*.p-dropdown .p-dropdown-clear-icon{*/
/*  position: absolute;*/
/*  margin-top: 5px;*/
/*  left: 83%;*/
/*}*/


/*.p-overlay-open {*/


/*}*/
/*.p-focus {*/

/*}*/
/*.p-highlight {*/

/*}*/
/*.p-dropdown-items-wrapper {*/
/*  overflow: scroll;*/
/*  border: 1px solid #dddddd;*/
/*  padding-top: 15px;*/
/*  padding-right: 23px;*/
/*  background-color: #2b2626;*/
/*}*/

/*.p-dropdown-items-wrapper ul{*/
/*  list-style-type: none;*/

/*}*/
/*.p-dropdown-items-wrapper::-webkit-scrollbar-thumb {*/
/*  background: #9c9a9a;*/
/*}*/
/*.p-dropdown-items-wrapper li{*/
/*  border: 1px solid #656865;*/
/*  margin-bottom: 10px;*/
/*  padding: 12px 0 12px 12px;*/

/*}*/


/*.p-dropdown-trigger {*/
/*  float: right;*/

/*}*/
/*.p-dropdown-panel {*/
/*  color: darkorange;*/

/*}*/
/*.p-dropdown-filter-container {*/
/*  background-color: #141414;*/
/*  padding: 12px;*/
/*}*/
/*.p-dropdown-filter {*/
/*  background-color: #353432;*/
/*  border-bottom: 1px solid darkorange;*/
/*  color: #dddddd;*/
/*  width: 100%;*/
/*  margin-right: -25px;*/
/*}*/

/*.p-dropdown-items {*/
/*  color: deepskyblue;*/
/*}*/

/*.p-dropdown-item {*/
/*  color: #dddddd;*/
/*  cursor: pointer;*/
/*}*/

</style>