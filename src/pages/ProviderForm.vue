<template>
  <div>
<!--    <h2  style="margin-top: 50px; margin-bottom: 50px">-TMI panel-</h2>-->
    <MDBContainer>
      <ErrorNotification
        :message = errorFormMessage
      />
      <form autocomplete="off" class="pro-form">
        <MDBInput
            label="Anna yrityksen nimi"
            v-model="yritys"
            white
            id="yritys"
            size="lg"
            wrapperClass="mb-4"/>
        <MDBInput
            label="Anna yrityksen y-tunnus"
            v-model="ytunnus"
            white
            id="ytunnus"
            size="lg"
            wrapperClass="mb-4"/>
        <MDBInput
          label="Anna osoitteesi"
          white
          id="osoite"
          size="lg"
          wrapperClass="mb-4"/>

        <p style="text-align: left; color: deepskyblue; font-size: 18px;">jos sädettä ei ole merkitty, se tarkoittaa, että tarjoat palvelua vain määritetyssä osoitteessa</p>

        <MDBInput
            type="text"
            wrapperClass="mb-4"
            @input="filterInput"
            :value="inputValue"
            label="Anna toiminta-alueen säde - km"
            white
            v-model="range"
            size="lg"
        />

        <div style=" margin-bottom: 20px;" >
          <Dropdown   v-model="profession" :options="prodata"   filter optionLabel="label" optionGroupLabel="label" showClear optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">

            <template value="slotProps" >
              <div v-if="slotProps.value" >
                <div>{{ slotProps.value.label }}</div>
              </div>
              <span v-else>
              {{ slotProps.placeholder }}
            </span>
            </template>
            <template  #optiongroup="slotProps" >
              <div style="" class="flex align-items-center">
                <div>{{ slotProps.option.label }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
        <div style="text-align: left;">
          <MDBRadio
              white
              label="Tuntihinta"
              name="aboutPrice"
              v-model="about_price"
              value="hour"
              wrapperClass="mb-4"
          />
        </div>

<!--        v-model="price"-->
        <MDBInput
            v-if="about_price === 'hour'"
            label="Anna tuntihinta"
            type="text"

            @input="filterInput"
            :value="inputValue"
            white
            v-model="price"
            size="lg"
            wrapperClass="mb-4"
        />
        <div style="text-align: left; ">
          <MDBRadio
              white
              label="Urakkahinta"
              name="aboutPrice"
              v-model="about_price"
              value="piece"
              wrapperClass="mb-4"
          />
        </div>

        <MDBTextarea
            white
            maxlength="100"
            v-model="proDescription"
            label="Kirjuta siia midagi endast ja oma tegevusest..."
            wrapperClass="mb-4"
            style="width: 100%; color: #ddd; "

        ></MDBTextarea>
        <span class="message-counter">{{ proDescription.length }} / 100</span>
        <MDBInput
            white
            label="Anna yrityksen kotisivun osoite jos on"
            size="lg"
            v-model="pro_link"
            wrapperClass="mb-4"
        />
        <div style="margin: 20px 0 20px 0; text-align: left;">
          <MDBCheckbox  label="Saatavilla 24/7"  v-model="isAvailable24_7" />
        </div>
        <MDBBtn outline="success" size="lg" block @click="addProvider">Add provider profile</MDBBtn>
        <MDBBtn outline="danger" size="lg" block @click="this.$router.push('/')" > Poistu </MDBBtn>

      </form>


    </MDBContainer>

  </div>
</template>

<script >
/*global google*/
/* eslint-disable no-new */

import { ref } from 'vue';
const key = require('../../server/config/keys')
const gTest = require('../../server/config/keys')
import proData from '@/components/profession/proList'
import Dropdown from 'primevue/dropdown';
import '@/css/style.css';
import '@/css/notification.css'
import '@/css/pro.css'

import errorNotification from '../components/notifications/errorMessage'


import {
  MDBContainer, MDBBtn, MDBInput, MDBCheckbox, MDBRadio, MDBTextarea
}from "mdb-vue-ui-kit";
import axios from "axios";

import mapService from '../service/map'
import providerService from '../service/providers'
//import availableService from '../service/calendarOffers'

export default {
  name: "provider-form",
  data () {
    return {
      user: null,
      result: "",
      errorFormMessage: null,
      //date: null,
      latitude: 0,
      longitude: 0,
      address: "",
      profession: null,
      userId: "",
      proDescription: "",
      prodata: proData
    }
  },
  setup () {
    const yritys = ref("")
    const ytunnus = ref("")
    const date = ref("")
    const price = ref("")
    const range = ref(null)
    const about_price = ref("hour")
    const pro_link = ref(null)
    let inputValue = ref('');
    const filterInput = ref((event) => {
      // Filter out non-digit characters
      const raw = event.target.value;

      // Only allow digits and a single dot
      let filtered = raw.replace(/[^0-9.]/g, '');

      // Only allow one dot
      const parts = filtered.split('.');
      if (parts.length > 2) {
        filtered = parts[0] + '.' + parts.slice(1).join('');
      }

      // Prevent leading dot (e.g., ".5" becomes "0.5")
      if (filtered.startsWith('.')) {
        filtered = '0' + filtered;
      }

      // Update input field directly
      event.target.value = filtered;
      inputValue.value = filtered;

      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvv " + inputValue.value)
    })

    const isAvailable24_7 = ref(false)
    return {
      yritys,
      ytunnus,
      date,
      price,
      range,
      about_price,
      pro_link,

      inputValue,
      filterInput,
      isAvailable24_7
    }
  },
  components: {
    MDBContainer,
    MDBBtn,
    MDBInput,
    MDBCheckbox,
    MDBRadio,
    MDBTextarea,
    //VueDatePicker,
    Dropdown,
    errorNotification
  },
  mounted () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      this.user = user;
      this.userId = user.id
      //console.log("User token: " + this.loggedUser.token)
      console.log("User id in Provider: " + user.id)
    }


    console.log("Google key is: " + gTest.google)
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
    // TODO look here if pressed enter in address bar, not working!!
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.latitude = place.geometry.location.lat()
      this.longitude = place.geometry.location.lng()

      console.log(place)
      console.log("Latitude: " + place.geometry.location.lat())
      console.log("Full address: "+ place.formatted_address)
      this.address = place.formatted_address
    })
  },

  methods: {
    canselSession () {
      //this.$router.push({path: '/'})
      this.$emit('cansel:provider', "Test")
    },


    getAddress () {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=01620+Raikukuja,+Vantaa&key=' + key.googleMap)
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message;
              console.log(response.data.error_message)
            } else {
              this.address = response.data.results[0].formatted_address
              //console.log(response.data.results[0].formatted_address)
              console.log(response.data.results[0].formatted_address)
              console.log(response.data.results[0].address_components[0].long_name)
              this.result = response.data.results[0].formatted_address
            }

          })
          .catch(error => {
            this.error = error.message
            this.spinner = false;
            console.log(error.message)
          })
    },
    // preventNegative (e) {
    //   // Prevent typing "-"
    //   if (e.key === '-' || e.key === 'e') {
    //     e.preventDefault();
    //   }
    // },

    async addProvider () {
      const provider = {
        yritys: this.yritys,
        ytunnus: this.ytunnus,
        description: this.proDescription,
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        profession: this.profession.label,
        //priceByHour: this.price,
        priceByHour: this.about_price === "hour" ? this.price : null,
        range: this.range === null ? 0 : this.range,
        proLink: this.pro_link,
        isAvailable24_7: this.isAvailable24_7,

      }

      const newProvider = await providerService.addProvider(this.userId, provider)
      console.log("Added provider::: " + newProvider)
      if (newProvider) {
        newProvider.user = {id: this.user.id, username: this.user.username}

        this.$router.push('/provider-panel');
        this.$emit("show-created-provider", newProvider);
      } else {
        this.errorFormMessage = "Tarkista kentat ja yritä uuddelleen!";
        setTimeout(() => {
          this.errorFormMessage = null
        }, 2000);
      }

    },

    testMonth () {
      //console.log("Month: " + this.date[0].getMonth())
    },

    async getTest () {

      const result = await mapService.getLocation()
      console.log("result " + result)
    }

  }
}
</script>

<style>
.pac-icon {
  display: none;
}
.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
.pac-item:hover {
  background-color: #ececec;
}
.pac-item-query {
  font-size: 16px;
}


.input {
  padding: 20px;
}
.pro_form_select {
  margin-bottom: 20px;
}


</style>