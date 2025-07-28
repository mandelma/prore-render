<template>
  <div>
    <MDBContainer
        style="position: relative; z-index: 1;
        /*width: 80%;*/
        margin-top: 80px;
        opacity: 0.8;
        "
    >

<!--      <MDBBtn color="danger" @click="puhasta">Puhasta kaardi andmed</MDBBtn>-->
      <div >
        <div :class="{hideMainPanel: !isMainPanel}" class="client-map-panel">
          <div style="display: flex; justify-content: right;">
            <MDBIcon size="lg" style="padding: 10px;" @click="closeMainPanel">
              <i class="fas fa-expand-arrows-alt"></i>
            </MDBIcon>
            <div>
              <MDBBtnClose
                  white
                  style=" padding: 10px;"
                  size="lg"
                  @click="$router.go(-1)"
              />
            </div>

          </div>
          <p v-if="!isNoAddressGiven" style="color: red;">Anna osoittesi!</p>

          <div id="address-panel">

            <MDBInput
                white
                inputGroup
                label="Anna toinen osoitteesi kun ei täsmää"
                v-model="address"
                id="autocomplete"
                size="lg"
                wrapperClass="mb-4"
            >
              <MDBBtnClose v-if="address" white style="float: right; margin-right: 7px; margin-top: 5px;" @click="clearOrderAddress"/>
            </MDBInput>

          </div>

          <div style=" margin-bottom: 20px;" >
            <Dropdown  @change="changedProfession"   v-model="prof" :options="prodata"   filter optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">

              <template value="slotProps" >
                <div v-if="slotProps.value" >
                  <!--              <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />-->
                  <div >{{ slotProps.value.label }}</div>
                </div>
                <span v-else>
              {{ slotProps.placeholder }}
            </span>
              </template>
              <template  #optiongroup="slotProps"  >
                <div style="" class="flex align-items-center">
                  <!--              <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />-->
                  <div >{{ slotProps.option.label }}</div>
                </div>
              </template>
            </Dropdown>
          </div>

          <div  :class="{hideDistSelectPanel: !isDistSelection}">
            <p style="text-align: left;">Valitse kiinnostavaa ajankohta tai heti!</p>
            <div class="distSelectPanel">


              <VueDatePicker
                  style="margin-bottom: 20px; width: 70%; padding: 7px;"
                  v-model="bookingDate"
                  dark
                  :min-date="new Date()"
                  teleport-center
                  @internal-model-change="handleInternalDate"
                  @update:model-value="handleDate"
                  :state="isNoDate ? false : null"
              >

              </VueDatePicker>
              <div style="margin-top: 15px;">
                <MDBCheckbox

                    white
                    label="Heti!"
                    name="selection"
                    v-model="isSelectNotNow"
                    value="true"
                    @click="removeDateIfExist"
                    wrapperClass="mb-4"
                />
              </div>

            </div>


          </div>


          <div  :class="{hideDistSelectPanel: !isDistSelection}" style=" margin-bottom: 13px;">
            <select style="padding: 12px; width: 100%; margin-bottom: 25px; background-color: dimgrey; color: white;" id="distance" v-model="distBtw" @click="filterByDistance">
              <option disabled value="0">Valitse etäisyys</option>
              <option value="1">1 km ympärilläsi</option>
              <option value="2">2 km ympärilläsi</option>
              <option value="3">3 km ympärilläsi</option>
              <option value="4">4 km ympärilläsi</option>
              <option value="5">5 km ympärilläsi</option>
              <option value="6">6 km ympärilläsi</option>
              <option value="7">7 km ympärilläsi</option>
              <option value="8">8 km ympärilläsi</option>
              <option value="9">9 km ympärilläsi</option>
              <option value="10">10 km ympärilläsi</option>
              <option value="20">20 km ympärilläsi</option>
              <option value="30">30 km ympärilläsi</option>
              <option value="40">40 km ympärilläsi</option>
              <option value="50">50 km ympärilläsi</option>
              <option value="60">60 km ympärilläsi</option>
              <option value="70">70 km ympärilläsi</option>
              <option value="80">80 km ympärilläsi</option>
              <option value="90">90 km ympärilläsi</option>
              <option value="100">100 km ympärilläsi</option>
              <option value="200">200 km ympärilläsi</option>
              <option value="300">300 km ympärilläsi</option>
            </select>
            <MDBBtn
                v-if="bookingDate || isSelectNotNow"
                color="success"
                @click="findSuitablePro"
            >
              Etsi ammatilainen
            </MDBBtn>

          </div>

          <p
              v-if="prof && isPressedFindBtn"
              :class="{noClients: isActiveProffs}"
              style="color: palevioletred;"
          >
            Ei ammattilaisia vielä!
          </p>

        </div>

      </div>


      <div v-if="isMapChat" style="background-color: white; margin: auto; padding: 10px; width: 350px;  border: solid darkgrey">
        <p style="float: right; color: limegreen;" @click="closeMapChat">Valmis</p>
        <chat-panel

            :chatusers = chatusers
            :messages =messages
            :selecteduser = selecteduser
            @select:user = selectUser
            @noSelected = noSelectUser
            @on:message = onMessage
        />
      </div>

      <div class="map-info-table" v-else-if="isTargetSelected && !isMapChat" style="background-color: white; color: darkslategrey; padding: 10px; width: 90%; margin: auto;  border: solid darkgrey">
        <div style="display: flex; justify-content: right;">
          <p style=" font-size: 15px; padding: 10px; color: green;" @click="outFromMarkerPanel">Valmis</p>
        </div>

        <MDBRow>
          <MDBCol lg="4">
            <div style="background-color: dimgrey; border-radius: 10px; padding: 13px; margin-bottom: 13px;">
              <div style="color: #ddd; font-size: 11px; display: flex; justify-content: right; padding: 7px 0;">

               {{ target.rating.positive > 0 ? target.rating.positive / target.rating.count : 0 }} tähteä &nbsp;
                ( {{ target.rating.count }} antajaa )
              </div>
<!--              proAvatar: this.provider.user.avatar.isImage === true ? this.provider.user.avatar.imageUrl : null,-->
<!--              <img style="width: 100px;" :src="require(`@/assets/avatar/avatar.png`)" alt="pro-image"/>-->
              <img style="width: 100px;"
                   :src="target.user.avatar.isImage === true ? target.user.avatar.imageUrl : require(`@/assets/avatar/avatar.png`)" alt="pro-image"/>
              <rating-stars :rating = "(target.rating.positive / target.rating.count)" />
            </div>


          </MDBCol>
          <MDBCol>
            <p style="margin-bottom: 13px;">{{target.description}}</p>
          </MDBCol>
        </MDBRow>

        <MDBTable responsive borderless style="font-size: 14px; width: 100%; text-align: left;">
          <tbody>
          <tr>
            <td>
              Yritys:
            </td>
            <td>
              {{ this.target.yritys }}
            </td>
          </tr>
          <tr>
            <td>
              Y - tunnus:
            </td>
            <td>
              {{this.target.ytunnus}}
            </td>
          </tr>
          <tr>
            <td>
              Työalue:
            </td>
            <td>
              {{this.target.range ? this.target.range + " km" : "Palvelun tarjous vain paikalla!"}}
            </td>
          </tr>
          <tr>
            <td>
              Palvelun hinta:
            </td>
            <td>
              {{this.target.priceByHour ? this.target.priceByHour + " Euroa / tunti": "Urakkahinta sovittaessa!"}}
            </td>
          </tr>
          <tr v-if="this.target.feedback.length > 0">
            <td :class="{hideFeedbackTitle: isShowRatingResults}">
              Palaute
            </td>
            <td v-if="!isShowRatingResults">
              <MDBBtn block color="info" @click="isShowRatingResults = true">Katso arvostelut &nbsp;( {{ target.feedback.length }} )</MDBBtn>
            </td>
            <td v-else colspan="2">
              <feedback-list
                  style="color: #ddd"
                  :feedback = this.target.feedback
                  @closeFeedbackList = handleCloseMapFeedbackList
              />
            </td>
          </tr>
          <tr v-if="this.target.pro_link">
            <td>
              Kotisivu
            </td>
            <td>
              <a :href="'//' + this.target.pro_link" target="_blank">
                Palveluntarjoajan kotisivu
              </a>
            </td>
          </tr>
          <tr v-if="target.user.id !== userId">
<!--            v-if="isCreatingChatPanel"-->
            <td colspan="2">
              <MDBBtn  style="float: right;" color="warning" size="lg" @click="createChatPanel">
                &nbsp;&nbsp;&nbsp;<i class="far fa-comments"></i>
              </MDBBtn>
            </td>
          </tr>
          <tr v-if="target.user.id !== userId && !isOrder">
            <td colspan="2">
              <MDBBtn  block color="success" size="lg" @click="createBooking">Tee tilaus</MDBBtn>
            </td>
          </tr>
          </tbody>
        </MDBTable>

      </div>


<!--      Make order panel-->

      <div v-if="isOrder" class="order">
<!--        <p style="color: green; display: flex; justify-content: right; padding: 20px;" @click="isOrder = false">Valmis</p>-->
        <div style="display: flex; justify-content: right; padding: 20px;">
          <MDBBtnClose
            white
            size="lg"
            @click="isOrder = false"
          />
        </div>
<!--        @submit.prevent="confirmOrder"-->
        <form >
          <p style="color: #00a6ff; text-align: left;">Address: {{address}}</p>
          order label {{ isNoOrderLabelAdded }}
          <p v-if="isNoOrderLabelAdded" style="color: palevioletred; ">Anna otsikko, pakollinen kenttä!</p>
          <MDBInput
              white
              label="Anna otsiko"
              v-model="orderHeader"
              wrapperClass="mb-4"
          />


<!--          orderDate-->
          <p style="text-align: left;">Missä ajalla haluaisit ammattilaista?</p>
          <p v-if="isNoOrderDateAdded" style="color:palevioletred;">Anna päivämäärä ja aika, pakollinen kenttä!</p>
          <div style="color: #fff;">
            <VueDatePicker
                style="margin-bottom: 20px;"
                v-model="bookingDate"
                dark
                :min-date="new Date()"
                teleport-center
                @internal-model-change="handleInternalDate"
                :state="isNoDate ? false : null"
            >

            </VueDatePicker>
            <p v-if="isNoOrderDescriptionAdded" style="color: palevioletred;">Anna kuvaus tehtävästä, pakollinen kenttä!</p>
            <MDBTextarea
                maxlength="70"
                label="Tehtävän kuvaus..."
                white
                rows="2"

                v-model="orderDescription"
                invalidFeedback="Ole hyvä ja kirjoita tehtävän kuvaus."
                validFeedback="Ok!"
                wrapperClass="mb-4"
            />
            <span class="message-counter">{{ orderDescription.length }} / 70</span>
          </div>
<!--          <MDBBtn block type="submit" :disabled="isOrderBtnDisabled" color="success">Tilaa</MDBBtn>-->
        </form>
        <MDBBtn block :disabled="isOrderBtnClicked" color="success" @click="confirmOrder">Tilaa</MDBBtn>

      </div>



<!--      <p style="color: red;">selecteduser {{selecteduser}}</p>-->

      <div v-if="!isTargetSelected">
        <div v-if=!isMainPanel >
          <img :src="require(`@/assets/left_back.png`)" alt="back" style="float: right; padding: 10px;" @click="returnToMainPanel"/>

<!--          <MDBIcon size="2x" style="float: right; padding: 10px;" @click="returnToMainPanel">-->
<!--            <i class="fas fa-expand-arrows-alt"></i>-->
<!--          </MDBIcon>-->
        </div>
      </div>



<!--      style="background-color:white; width: 40%; float: right;"-->
      <div v-if="!isMainPanel && countOfSelectedProfessional > 0 && !isTargetSelected" style="background-color:white; width: 300px; margin: auto;">
        <div v-if="bookingDate">
          <p  style="color: blue; font-size: 14px; text-align: left; padding: 15px">
            Valittu aika: {{bookingDate.getDate() + " / " + (bookingDate.getMonth() + 1) + " klo " +  bookingDate.getHours() + ":" + (bookingDate.getMinutes().length < 2 ? "0" + bookingDate.getMinutes() : bookingDate.getMinutes())}}
          </p>
          <p style="color: darkgreen; font-size: 17px; font-weight: bold; text-align: left; padding-left: 15px;">Vihreä merkki - saatavilla </p>
          <p style="color: darkorange; font-size: 17px ; font-weight: bold; text-align: left; padding-left: 15px;">Oranssi merkki - sovitaessa </p>
        </div>

        <p style="color: #9fa6b2; font-size: 14px; text-align: left; padding: 15px; ">
          Napsauta merkkiä nähdäksesi palveluntarjoajan!
        </p>

      </div>


    </MDBContainer>

    <div id="map"></div>


  </div>

</template>

<script>
/* eslint-disable */
/*global google*/
import axios from 'axios'
import recipientService from '../service/recipients'
import providerService from '../service/providers'
import dt from '../components/controllers/datetime'
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBBtnClose,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBadge,
  MDBTextarea,
  MDBTable,
  MDBCheckbox
} from "mdb-vue-ui-kit";
import {loadGoogleMaps}  from '@/components/utils/loadGoogleMaps'
import distance from '../components/controllers/distance'
import gMap from '../components/location'
import proData from '@/components/profession/proList'
import chatPanel from '@/pages/LiveChat'
import VueDatePicker from '@vuepic/vue-datepicker';
import feedbackList from "@/components/FeedbackList";
import Dropdown from 'primevue/dropdown';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

import '@/css/pro.css'
//import {Client} from "@googlemaps/google-maps-services-js";
import  { onMounted, ref } from "vue";
import socket from "@/socket";
import RatingStars from "@/components/RatingStars";
export default {
  name: "recipient-public",
  props: {
    userIsProvider: Object,
    selecteduser: null,
    chatusers: Array,
    messages: Array,
    isProviderLoggedIn: Boolean
  },
  components: {
    RatingStars,
    chatPanel,
    MDBContainer,
    MDBInput,
    MDBBtn,
    MDBBtnClose,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBBadge,
    MDBTextarea,
    MDBTable,
    MDBCheckbox,
    feedbackList,
    Dropdown,
    VueDatePicker
  },
  data () {

    return {
      isMapReady: false,
      obj: null,
      stateActive: false,
      datetime: dt,
      isOrder: false,
      target: {}, // Selected provider from map
      isTargetSelected: false,
      isMainPanel: true,
      isCreatingChatPanel: false,
      prof: null,
      username: null,
      userId: null,
      providerId: null,
      address: null,
      isNoAddressGiven: true,
      myLat: null,
      mylng: null,
      countOfSelectedProfessional: 0,
      isActiveProffs: false,
      isDistSelection: false,
      professional: "Automaalari",
      currentProfession: "",
      distBtw: 0,
      prodata: proData,
      room: null,
      isShowRatingResults: false,
      isChatPanel: true,
      isMapChat: false,
      providers: [],

      selectedProPosition: null,
      bookingDate: null,
      isSelectNotNow: false,
      isPressedFindBtn: false,
      orderDate: null,
      orderHeader: "",
      orderDescription: "",
      isCompleteOrder: false,
      isOrderBtnClicked: false
    }
  },

  computed: {
    isNoOrderLabelAdded () {
      return this.orderHeader === "" && this.isCompleteOrder;
    },
    isNoOrderDateAdded () {
      return this.bookingDate === null && this.isCompleteOrder;
    },
    isNoOrderDescriptionAdded () {
      return this.orderDescription === "" && this.isCompleteOrder;
    }
  },

  async mounted () {
    //await loadGoogleMaps();

    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.username = user.username;
      this.userId = user.id
      //console.log("User token: " + this.loggedUser.token)
    }

    if (Capacitor.isNativePlatform()) {
      this.getCurrentLocation();
    }

    this.resizeMap();

    this.userCurrentLocation();

    const selectDistance = document.getElementById
    ("distance");

    selectDistance.addEventListener("change", (event) => {
      this.distBtw = parseFloat(event.target.value);
      this.stateActive = true;
      const data = {
        profession: this.currentProfession,
        distance: parseFloat(event.target.value)
      }

      //window.localStorage.setItem('mapSearchData', JSON.stringify(data));

      //console.log("+++++++++++ " + this.countOfSelectedProfessional > 0)

      //this.showClientLocationOnTheMap(this.currentProfession, this.distBtw);

    })

    //this.setUserPlace ("address-autocomplete");

    const input = document.getElementById("autocomplete");

    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "fi" },
      fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
      strictBounds: false,
      //types: ["establishment"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options)
    //const autocomplete = client.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.myLat = place.geometry.location.lat();
      this.myLng = place.geometry.location.lng();

      this.getAddressFrom(place.geometry.location.lat(), place.geometry.location.lng())
      this.address = place.formatted_address;
      console.log("Address xxxx " + place.formatted_address)
      console.log("place-----------" + this.myLat)
    });

  },
  methods: {
    async getCurrentLocation() {

      // for iOS: In ios/App/Info.plist, add:
      // <key>NSLocationWhenInUseUsageDescription</key>
      // <string>Your location is used for...</string>
      // <key>NSLocationAlwaysUsageDescription</key>
      // <string>Your location is used for...</string>
      try {
        const mockLocation = {
          coords: {
            latitude: 60.2767265,
            longitude: 24.8575089
          }
          // coords: {
          //   latitude: 60.1699,
          //   longitude: 24.9384
          // }
        };
        console.log('Mocked location:', mockLocation.latitude);
        // Request geolocation permission
        const permission = await Geolocation.requestPermissions();

        if (permission.location === 'granted') {
          // Get current position
          const position = await Geolocation.getCurrentPosition({
            timeout: 20000, // 20 seconds
            enableHighAccuracy: true
          });
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.error('Error getting location', error);
      }
    },
    async watchLocation() {
      const wait = await Geolocation.watchPosition({}, (position, error) => {
        if (error) {
          console.error('Error watching location', error);
          return;
        }
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
      });

      // To stop watching the location
      // Geolocation.clearWatch({ id: wait });
    },
    loadGoogleMapsScript() {
      return new Promise((resolve) => {
        if (window.google && window.google.maps && google.maps.geometry) {
          resolve();
        } else {
          window.initMap = () => resolve();
          const script = document.createElement("script");
          script.src =
              `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&libraries=places,geometry&v=beta&callback=initMap`
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }
      });
      },
    setUserPlace (currentId) {
      const input = document.getElementById(currentId);


      const center = { lat: 50.064192, lng: -130.605469 };
      const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };
      const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "fi" },
        fields: ["address_components", "geometry", "icon", "name", "formatted_address"],
        strictBounds: false,
        //types: ["establishment"],
      };

      const autocomplete = client.places.Autocomplete(input, options);

      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace()
        this.myLat = place.geometry.location.lat();
        this.myLng = place.geometry.location.lng();
        this.isNoAddressGiven = true;
        this.getAddressFrom(place.geometry.location.lat(), place.geometry.location.lng())
        this.address = place.formatted_address;
        // console.log("Address xxxx " + place.formatted_address)
        // console.log("place-----------" + this.myLat)
      });
    },
    clearOrderAddress () {
      this.address = null;
    },

    handleCloseMapFeedbackList () {
      this.isShowRatingResults = false;
    },
    puhasta () {
      console.log("Puhastatud")
      //window.localStorage.removeItem('mapSearchProData');
    },
    removeDateIfExist () {
      console.log("Clicked, functioning");
      console.log("IS now`` " + this.isSelectNotNow)
      if (this.isSelectNotNow) {
        this.bookingDate = null;
      } else {
        this.bookingDate = new Date();
      }

      // if (this.bookingDate && !this.isSelectNow) {
      //   this.bookingDate = new Date();
      // }
    },
    async handleDate (date) {
      console.log("Date handled!" + date);
      if (date) {
        this.isSelectNotNow = false;
      }
      if (this.stateActive) {
        const providers = await providerService.getProviders()
        if (providers !== null) {
          //this.otherUserLocations(providers, this.currentProfession, this.distBtw);
        }
      }
    },
    // handleInternalDate () {
    //   console.log("InternalDate!!!")
    // },
    /*isNoDate () {
      console.log("No date")
    },*/
    changedProfession () {
      console.log("Changed " + this.prof.label);
      this.showClientLocationOnTheMap(this.prof.label, this.distBtw);
      this.currentProfession = this.prof.label;
      this.isDistSelection = true;
    },
    selectUser(user) {
      this.$emit('select:user', user);
      //if (!user.self)
      //this.selectedUser = user;
    },

    noSelectUser () {
      this.$emit("noSelected");
    },
    onMessage(content, blob, date) {

      this.$emit("on:message", content, blob, date);

    },
    resizeMap() {
      var myMap = document.getElementById('map');
      myMap.style.height = "100%";
      myMap.style.width = "100%";
    },
    receive (){
      this.$router.push('/rf')
      //this.$router.push('recipient-form');

    },
    userCurrentLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          // Show a map centered at latitude / longitude.
          this.myLat = latitude
          this.myLng = longitude
          console.log("myLat " + latitude)
          this.showUserLocationOnTheMap (latitude, longitude)
        });
      }

    },

    pinSymbol(color, stroke_color) {
      const priceTag = document.createElement("div");

      priceTag.className = "price-tag";
      priceTag.textContent = "$2.5M";
      return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: stroke_color,
        strokeWeight: 2,
        scale: 1,
        labelOrigin: {
          x: 60,
          y: -25
        }
      };
    },
    // Kasutaja sihtkoht, otsitakse automaatselt
    showUserLocationOnTheMap (latitude, longitude) {
      //const client = new Client({});
      try {
        new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          accuracy: 50,

        });
      } catch(err) {
        console.log("Error to load map: " + err.message);
      }


      // new google.maps.Marker({
      //   position: new google.maps.LatLng(latitude, longitude),
      //   accuracy: 50,
      //   map: map,
      //   icon: this.pinSymbol('yellow'),
      //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
      // })
      this.getAddressFrom (latitude, longitude)
    },
    // Siis kui sisestada käsitsi aadress
    getAddressFrom (lat, long) {
      //const client = new Client({});
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +
          "," + long
          + "&key=" + process.env.VUE_APP_MAP_KEY)
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message;

              console.log(response.data.error_message)
            } else {
              const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 13,
                center: new google.maps.LatLng(lat, long),
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });

              // AIzaSyBDA2EBoGezJx51wQtxoW3Ecq5Ql8CCAiE

              this.address = response.data.results[1].formatted_address
            }

          })
          .catch(error => {
            this.error = error.message
            console.log(error.message)
          })
    },

    distanceBtw (originLat, originLng, destLat, destLng) {
      // let distance = null;
      //
      // this.loadGoogleMapsScript().then(() => {
      //
      //   const origin = new google.maps.LatLng(originLat, originLng);
      //   const destination = new google.maps.LatLng(destLat, destLng);
      //
      //   distance = (google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 100).toFixed(2) ;
      //   console.log("Distance (km):", (distance / 1000).toFixed(2));
      // });
      // return distance;
      var origin = new google.maps.LatLng(originLat, originLng);
      var destination = new google.maps.LatLng(destLat, destLng);
      return (google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000).toFixed(2);
    },

    findSuitablePro () {
      if (this.address) {
        this.isPressedFindBtn = true;
        this.showClientLocationOnTheMap(this.currentProfession, this.distBtw);
      } else {
        console.log("No address given!");
        this.isNoAddressGiven = false;
      }

    },

    datetimeFitting (to) {
      let date;

      if (this.bookingDate) {
        let year = this.bookingDate.getFullYear();
        let month = this.bookingDate.getMonth();
        let day = this.bookingDate.getDate();
        let hour = this.bookingDate.getHours();
        let minute = this.bookingDate.getMinutes();

        console.log("Booking date 2 " + new Date(year, month, day, hour, minute));
        date = new Date(year, month, day, hour, minute);
      }

      return this.datetime.providerMatchingForClient(
          date,
          {y: to.yearFrom, m: to.monthFrom, d: to.dayFrom, hour: to.hoursFrom, min: to.minutesFrom},
          {y: to.yearTo, m: to.monthTo, d: to.dayTo, hour: to.hoursTo, min: to.minutesTo}
      )
    },

    async otherUserLocations (providers, profession, dist) {
      //const client = new Client({});
      let prev_infowindow = false;

      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        center: new google.maps.LatLng(this.myLat, this.myLng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      console.log("Users count: " + providers.length)
      console.log("Current distance " + dist)
      let date;
      if (this.bookingDate) {
        let year = this.bookingDate.getFullYear();
        let month = this.bookingDate.getMonth();
        let day = this.bookingDate.getDate();
        let hour = this.bookingDate.getHours();
        let minute = this.bookingDate.getMinutes();

        console.log("Booking date 2 " + new Date(year, month, day, hour, minute));
        date = new Date(year, month, day, hour, minute);
      }

       // new google.maps.Marker({
       //   position: new google.maps.LatLng(this.myLat, this.myLng),
       //   accuracy: 50,
       //   map: map,
       //   icon: this.pinSymbol('yellow'),
       //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
       // })
      let count = 0;

      if (providers.length > 0) {
        this.target = {};

        for (let pos = 0; pos < providers.length; pos++) {
          console.log("------------ " + providers[pos].yritys);
          //console.log("Client latitude: " + recipient[pos].latitude)
          //console.log("Client longitude: " + recipient[pos].longitude)
          let myLatLong = [this.myLat, this.myLng];

          providers[pos].profession.forEach(prof => {
            if (prof === profession) {



              //his.providers.push(providers[pos])
              console.log("Pro " + prof.yritys)
              let providerLatLng = [providers[pos].latitude, providers[pos].longitude];
              console.log("Distance btw " + this.distanceBtw(this.myLat, this.myLng, providers[pos].latitude, providers[pos].longitude));

              //distance.theDist()

              //this.countOfSelectedClient++;
              this.isActiveProffs = true;

              if (this.distanceBtw(this.myLat, this.myLng, providers[pos].latitude, providers[pos].longitude) <= dist) {
                count ++;

                let marker;
                // if (providers[pos].isAvailable24_7) {
                //   console.log("Yes it is availblr")
                //   marker = new google.maps.Marker({
                //     position: new google.maps.LatLng(providers[pos].latitude, providers[pos].longitude),
                //     accuracy: 50,
                //     map: map,
                //     title: providers[pos].yritys,
                //     icon: this.pinSymbol('green'),
                //     label: { color: '#79f759',  fontWeight: 'bold', fontSize: '14px', text: "Saatavilla!"}
                //   })
                // }

                // text: "Saatavilla!"
                if (providers[pos].isAvailable24_7) {
                  marker = new google.maps.Marker({
                    position: new google.maps.LatLng(providers[pos].latitude, providers[pos].longitude),
                    accuracy: 50,
                    map: map,
                    title: providers[pos].yritys,
                    icon: this.pinSymbol('seagreen', 'darkgreen'),
                    label: { color: 'green',  fontWeight: 'bold', fontSize: '14px', }
                  })
                } else {
                  if (providers[pos].timeoffer.length > 0) {
                    providers[pos].timeoffer.map(time => {
                      console.log("Year: " + time.yearFrom)
                      console.log("Fitting datetime: " +
                          this.datetime.providerMatchingForClient(
                              date,
                              {y: time.yearFrom, m: time.monthFrom, d: time.dayFrom, hour: time.hoursFrom, min: time.minutesFrom},
                              {y: time.yearTo, m: time.monthTo, d: time.dayTo, hour: time.hoursTo, min: time.minutesTo}
                          )

                      )


                      if (this.datetime.providerMatchingForClient(
                          date,
                          {y: time.yearFrom, m: time.monthFrom, d: time.dayFrom, hour: time.hoursFrom, min: time.minutesFrom},
                          {y: time.yearTo, m: time.monthTo, d: time.dayTo, hour: time.hoursTo, min: time.minutesTo}
                      ) || providers[pos].isAvailable24_7) {

                        marker = new google.maps.Marker({
                          position: new google.maps.LatLng(providers[pos].latitude, providers[pos].longitude),
                          accuracy: 50,
                          map: map,
                          title: providers[pos].yritys,
                          icon: this.pinSymbol('seagreen', 'darkgreen'),
                          //label: { color: '#79f759',  fontWeight: 'bold', fontSize: '14px', text: "Saatavilla!"}
                        })
                      } else {

                        marker = new google.maps.Marker({
                          position: new google.maps.LatLng(providers[pos].latitude, providers[pos].longitude),
                          accuracy: 50,
                          map: map,
                          title: providers[pos].yritys,
                          icon: this.pinSymbol('orange', 'darkorange'),
                          //label: { color: '#f79859',  fontWeight: 'bold', fontSize: '14px', text: "Sovitaessa!"}
                        })

                      }
                    })
                  } else {
                    marker = new google.maps.Marker({
                      position: new google.maps.LatLng(providers[pos].latitude, providers[pos].longitude),
                      accuracy: 50,
                      map: map,
                      title: providers[pos].yritys,
                      icon: this.pinSymbol('orange', 'darkorange'),
                      //label: { color: '#f79859',  fontWeight: 'bold', fontSize: '14px', text: "Sovitaessa!"}
                    })
                  }
                }



                window.myGlobalFunction = this.openMarker;

                const content = "class='map-info-window'"

                const infowindow = new google.maps.InfoWindow({
                  //content: "Hei hei!"
                  //content:'<p id="map-info-window">Hello World!</p>'
                  //content: "TMI: " + providers[pos].yritys
                });

                google.maps.event.addListener(marker, 'click', function() {
                  //infowindow.setContent(content);


                  console.log("POOOOS " + pos)
                  let p = pos

                  if( prev_infowindow ) {
                    prev_infowindow.close();
                  }

                  prev_infowindow = infowindow;


                  infowindow.open(map,marker);

                  //infowindow.setContent("<div  class='map-info-window'>" + '<p style="color: green; ">'+providers[pos].yritys+'</p>' + '<p style="color: red; " onclick="myGlobalFunction('+ p +' )">Tiedot</p>' + "</div>")
                  infowindow.setContent("<div  " +
                      "class='map-info-window'>" +
                      '<p style="color: green; ">'+
                      providers[pos].yritys+'</p>' +
                      '<p style="color: red; " ' +
                      'onclick="myGlobalFunction('+ p +' )"' +
                      '>Tiedot' +
                      '</p>' +
                      "</div>")
                });

                console.log("Prev infowondow " + prev_infowindow)

              }

            }
          })

        }


        if (count > 0) {
          this.isActiveProffs = true;
          this.isMainPanel = false;

        } else {
          this.isActiveProffs = false;
        }
        this.countOfSelectedProfessional = count;
        console.log("countxx " + count)
        this.identifyProfText();
        //console.log("Count " + this.countOfSelectedClients)

      }

    },

    handleInitChat (isActive, bookingId, counter, isCounter) {
      if (this.target.user.username !== this.username) {
        const room = this.target.yritys + this.username;
        //console.log("Username in map: " + this.target.user.username);
        //console.log("Room in map " + this.room);

        const createChatRoom = {
          status: "map",
          useCounter: isCounter,
          isActive: isActive,
          bookingID: bookingId,
          same_room_counter: counter,
          isOnline: true,
          room: this.room,
          pro: this.target.yritys,
          username: this.username,
          bookerUsername: this.username,
          bookerID: this.userId,
          providerUsername: this.target.user.username,
          providerID: this.target.user.id
        }
        const chatCredentials = {
          useCounter: isCounter,
          isActive: isActive,
          bookingID: bookingId,
          same_room_counter: counter,
          room: this.room,
          proID: this.target.user.id,
          pro: this.target.yritys,
          // userID: this.target.user.id,
          // username: this.target.user.username
          userID: this.userId,
          username:this.username
        }
        //this.$emit("chatCredentials", chatCredentials);

        this.$emit("initializeChat", {
          initChatRoom: createChatRoom,
          chatData: chatCredentials
        });

      }
    },

    createChatPanel () {
      // if (this.target.user.username !== this.username) {
      //   const room = this.target.yritys + this.username;
      //   console.log("Username in map: " + this.target.user.username);
      //   console.log("Room in map " + this.room);
      //   // Room users in server will be created
      //   socket.emit("create room users", {
      //     room: this.room,
      //     pro: this.target.yritys,
      //     status: "map",
      //     username: this.username,
      //     providerUsername: this.target.user.username,
      //     providerID: this.target.user.id
      //   })
      //   const chatCredentials = {
      //     room: this.room,
      //     userID: this.target.user.id,
      //     username: this.target.user.username
      //   }
      //   this.$emit("chatCredentials", chatCredentials);
      // }
      this.handleInitChat(false, "0", 0, true);
      this.isMapChat = true
    },

    async openMarker (p) {
      console.log("Booking date " + new Date(this.bookingDate));
      const d = this.bookingDate;


      //this.noSelectUser();
      //console.log("Profession " + this.currentProfession);
      console.log("Pro profession " )
      const pro = [this.currentProfession]
      // if (this.target.user.username !== this.username) {
      //   this.room = this.target.yritys + this.username;
      // }


      const providersMatchingProSearch = await providerService.getProvidersMatchingByProfession({result: pro});

      let dataForward = [];

      providersMatchingProSearch.forEach(pms => {

        console.log("Results: " + pms.user.id);
        let distance = parseInt(this.distanceBtw(this.myLat, this.myLng, pms.latitude, pms.longitude)).toFixed(0)
        console.log("Distance to display " + distance);
        dataForward = dataForward.concat({
          id: pms.user.id,
          dist: distance,
          pro: this.currentProfession
        })
      })

      socket.emit("map search report", dataForward);

      const providers = await providerService.getProviders()
      if (providers) {
        //console.log("watcher position " + this.myLat + " / " + this.myLng);
        if (providers[p].user.username !== this.username) {
          this.isCreatingChatPanel = true
        }

        console.log("Room in client map: " + this.room);

        this.target = providers[p];
        //window.localStorage.setItem('mapSearchProData', JSON.stringify(p));
        if (this.username) {
          this.room = this.target.yritys + this.username;
        } else {
          this.room = "nipitiri";
        }
        this.isTargetSelected = true;
        //console.log("Pooooos ---- " + p);
        //this.otherUserLocations(providers, this.currentProfession, this.distBtw)
      }

    },
    createBooking () {
      console.log("Here you can make an order! " + this.address)
      if (this.isSelectNotNow) {
        this.bookingDate = null;
      }
      this.isOrder = true;
    },


    async confirmOrder () {
      //console.log("Order, target id " + this.target.id);
      if (this.isOrderBtnClicked) return;

      this.isOrderBtnClicked = true;
      this.isCompleteOrder = true;
      let recipient = null;

      if (this.orderHeader !== "" && this.bookingDate !== null && this.orderDescription !== "") {
        if (this.bookingDate) {
          let year = this.bookingDate.getFullYear();
          let month = this.bookingDate.getMonth();
          let day = this.bookingDate.getDate();
          let hour = this.bookingDate.getHours();
          let minute = this.bookingDate.getMinutes();
          const dateForMs = new Date(year, month, day, hour, minute).getTime();

          recipient = {
            created: this.bookingDate,
            created_ms: dateForMs,
            header: this.orderHeader,
            address: this.address,
            latitude: this.myLat,
            longitude: this.myLng,
            professional: this.currentProfession,
            isIncludeOffers: false,
            year: this.bookingDate.getFullYear(),
            month: this.bookingDate.getMonth(),
            day: this.bookingDate.getDate(),
            hours: this.bookingDate.getHours(),
            minutes: this.bookingDate.getMinutes(),
            description: this.orderDescription,
            status: "notSeen",
            ordered: this.target.id
          }
        }

        console.log("Address: " + this.address);
        const booking = await recipientService.addRecipient(this.userId, recipient)


        const proBooking = await recipientService.getBookingById(booking.id);
        await recipientService.addProviderData(booking.id, this.target.id);
        const bookingToProvider = await providerService.addProviderBooking(this.target.id, booking.id);
        if (recipient && bookingToProvider === "Recipient is added!") {
          console.log("Iiiiisss " + (this.target.yritys + this.username))
          const room = this.target.yritys + this.username;
          const chatUserDataNavbar = {
            status: "",
            userID: this.target.user.id,
            name: this.target.user.username,
            room: room
          };

          const id = this.target.user.id;
          await this.$emit('booking_map:update', booking)
          await socket.emit("accept provider", {
            id,
            booking: proBooking,
          })

          recipient = null;

        } else {
          console.log("There is error to load recipient!")
        }

        this.$router.push('/received')
      } else {
        console.log("Not all requied credentials are setted!")
      }


    },

    async outFromMarkerPanel () {
      this.isTargetSelected = false
      //this.isMainPanel = true;
      this.noSelectUser();
      //window.localStorage.removeItem('mapSearchProData');
      const providers = await providerService.getProviders()
      if (providers !== null) {
        this.otherUserLocations(providers, this.currentProfession, this.distBtw);
      }
    },

    closeMapChat () {
      this.isMapChat = false
    },

    async returnToMainPanel () {
      this.isMainPanel = true;
      this.bookingDate = null;
      this.isSelectNotNow = false;
      this.distBtw = 0;
      await this.showClientLocationOnTheMap(this.currentProfession, this.distBtw);
      this.isPressedFindBtn = false;

      //window.localStorage.removeItem('mapSearchData')
      this.noSelectUser();

      // const providers = await providerService.getProviders()
      // if (providers !== null) {
      //   this.otherUserLocations(providers, "", "");
      // }
      //this.currentProfession = ""
      // this.prof = "";
      // this.distBtw = 0
    },

    closeMainPanel () {
      this.isMainPanel = false;
      this.noSelectUser();
      console.log("Close main panel")
    },

    // renderClients (event) {
    //   console.log("Event value " + event.target.value)
    //   //this.countOfSelectedClients = 0;
    //
    //   if (event.target.value) {
    //     // @click="renderClients($event)"
    //     this.showClientLocationOnTheMap(event.target.value)
    //
    //   }
    //   this.prof = event.target.value
    //
    //   event.target.value = ""
    //
    // },


    async showClientLocationOnTheMap (profession, dist) {

      console.log("Current distance herexx  " + dist)
      const providers = await providerService.getProviders()
      if (providers !== null) {
        if (!window.google) {
          this.otherUserLocations(providers, profession, dist);
        } else {
          this.otherUserLocations(providers, profession, dist);
        }

      }

    },
    identifyProfText () {
      if (this.countOfSelectedProfessional > 1) {
        this.professional = "ammattilaista"
      } else {
        this.professional = "ammattilainen"
      }
    }

  }
}
</script>

<style>
.custom-input input {
  color: pink !important;
  border: 2px solid red !important;
}
.ui.button,
.dot.circle {
  background-color: #ff5a5f;
  color: white;
}

.distSelectPanel {
  display: flex;
  justify-content: space-between;
}



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
.spinner-border {

}

.client-map-panel {
  background-color: #2b2a2a;
  padding: 10px;
  margin: auto;
  width: 30%;
  float: right;
}


#map {
  background:  url(/src/assets/map.gif)  no-repeat center center;

}

#map {
   position: absolute;

  /*height: 500px; !* The height is 400 pixels *!*/
  /*width: 100%; !* The width is the width of the web page *!*/

   top: 120px;
   right: 0;
   bottom: 20px;
   left: 0;
 }

.map-info-window {
  /*width: 200px;*/

}

#address-panel {
  margin-top: 10px;
}

@media only screen and (max-width: 500px) {
  .hideFeedbackTitle {
    display: none !important;
  }
}

@media only screen and (max-width: 1000px) {
  #address-panel {
    display: none !important;
  }
  .client-map-panel {
    background-color: #2b2a2a;
    padding: 10px;
    margin: auto;
    width: 80%;
    float: none;
  }
}

.activeClients {
  display: none !important;
}
.noClients {
  display: none !important;
}
.hideDistSelectPanel {
  display: none !important;
}
.hideMainPanel {
  display: none !important;
}
h3 {
  padding: 10px;
  color: #0095ff;
}
.minmax-icon {
  padding: 12px;
}

.map-info-table  td {
  border: 1px solid lightgrey;
  padding: 5px;
}

.order{
  color:#dddddd;

  /*background-color:rgba(255, 0, 0, 0.5);*/
  /*background-color:#221a16;*/
  background-color: #434240;
  /*opacity: 0.2  ;*/
  /*height:300px;*/
  width:90%;
  margin: auto;
  padding: 14px;
  /*display:flex;*/
  /*align-items:center;*/
  /*justify-content:center;*/


  /*top: 50vh; left: 50vw; transform: translate(-50%, -50%);*/
  /*top: 50vh; left: 50vw; transform: translate(-50%, -50%);*/
  position:relative;
  /*bottom:5px;*/
  /*right:5px;*/
}

</style>