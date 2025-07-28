<template>
  <div>

    <MDBContainer
        style="position: relative; z-index: 1;
        opacity: 0.8;
        margin-top: 60px;"
    >
      <div style="display: flex; justify-content: right;">
        <div id="address_input" class="proSelectAddress">
          <MDBInput
              white
              label="Anna osoitteesi jos ei täsmää..."
              v-model="address"
              id="autocomplite"
              size="lg"
              wrapperClass="mb-4"/>
        </div>
      </div>


<!--      class="ui large segment form"-->
      <div class="pro-map-panel">

        <div style=" margin-bottom: 20px;" >
          <Dropdown  @change="changedProfessional"   v-model="prof" :options="prodata"   filter optionLabel="label" optionGroupLabel="label"  optionGroupChildren="items" placeholder="Valitse ammattilainen" class="w-full md:w-100rem">

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

        count of clients {{countOfSelectedClients}}

        <div :class="{hideDistSelectPanel: !isDistSelection}" style="margin-bottom: 20px; width: 100%;">
          <select id="distanceOfClient" v-model="distBtw">
            <option disabled value="1">1 kilometriä ympärilläsi</option>
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
        </div>


        <p
            :class="{activeClients: !isActiveClients}"
        >
          {{countOfSelectedClients + " " + client}}  tarvitsee palveluasi
        </p>
        <p
            v-if="prof"
            :class="{noClients: isActiveClients}"
        >
          Ei asiakkaita vielä!
        </p>

        <MDBBtn color="dark"
                size="lg"
                block
                @click="provide"
                style="position: relative; z-index:1; opacity: 1.2;"
        >
          Tarjoa omaa palvelua
        </MDBBtn>
        <MDBBtn color="danger"
                size="lg"
                block
                @click="$router.go(-1)"
                style="position: relative; z-index:1; opacity: 1.0;"
        >
          Poistu kartalta
        </MDBBtn>

      </div>









    </MDBContainer>
<!--    <h3 style="margin-top: 50px;">Kartta ladataan...</h3>-->
<!--    <div class="spinner-border" role="status">-->
<!--      <span class="visually-hidden">Loading...</span>-->
<!--    </div>-->

    <div id="map"></div>

  </div>
</template>

<script>
/* eslint-disable */
/*global google*/
import axios from 'axios'
import recipientService from '../service/recipients'
import providerService from '../service/providers'
import { useRoute } from 'vue-router';
import {
  MDBContainer,
  MDBInput,
  MDBBtn
} from "mdb-vue-ui-kit";
import proData from '@/components/profession/proList'
import Dropdown from 'primevue/dropdown';
import '@/css/pro.css'
import gMap from '../components/location'
//import {onMounted} from "vue";
export default {
  name: "provider-public",
  props: {
    userIsProvider: Object,
    isProviderLoggedIn: Boolean
  },
  components: {
    Dropdown,
    MDBContainer,
    MDBInput,
    MDBBtn
  },
  data () {
    const route = useRoute()
    return {
      route,
      prof: null,
      userId: null,
      providerId: null,
      address: null,
      myLat: null,
      mylng: null,
      countOfSelectedClients: 0,
      isActiveClients: false,
      client: "",
      isDistSelection: false,
      distBtw: 1,
      currentProfessional: "",
      prodata: proData
    }

  },
  // setup () {
  //   onMounted(() => {
  //     if (!window.google) {
  //       const script = document.createElement("script");
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&libraries=places,geometry`;
  //       script.async = true;
  //       script.defer = true;
  //       document.head.appendChild(script);
  //       console.log("Map is inited in ProfiderPublic!");
  //     }
  //   })
  //   return {
  //
  //   }
  //},
  mounted () {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.userId = user.id
      //console.log("User token: " + this.loggedUser.token)
    }
    this.resizeMap();
    //console.log("Is provider in " + this.isProviderLoggedIn)

    //console.log("User id in providers " + this.userId)



    //this.setProviderId()

    const myMarker = new google.maps.Marker({
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    })

    this.userCurrentLocation();

    const selectDistanceBetween = document.getElementById("distanceOfClient");

    selectDistanceBetween.addEventListener("change", (event) => {
      this.distBtw = parseFloat(event.target.value);
      //alert("Profession selected: " + event.target.value)
      console.log("Current distance in beginning " + this.distBtw)
      this.showClientLocationOnTheMap(this.currentProfessional, this.distBtw);
      //this.showClient
    })

    const input = document.getElementById("autocomplite");

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
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.myLat = place.geometry.location.lat();
      this.myLng = place.geometry.location.lng();

      this.getAddressFrom(place.geometry.location.lat(), place.geometry.location.lng())
      this.address = place.formatted_address
      console.log(place)
    });




    // let map = new google.maps.Map(document.getElementById("map"), {
    //   zoom: 13,
    //   center: new google.maps.LatLng(this.myLat, this.myLng),
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    //   accuracy: 50,
    //
    // });

  },
  methods: {
    changedProfessional () {
      console.log("Changed " + this.prof.label);
      this.showClientLocationOnTheMap(this.prof.label, this.distBtw);
      this.currentProfessional = this.prof.label;
      this.isDistSelection = true;
    },
    resizeMap() {
      var myMap = document.getElementById('map');
      myMap.style.height = "100%";
      myMap.style.width = "100%";
    },
    provide (){
      // if (this.mapDiv !== null) {
      //
      // }
      this.$router.push('/provider-form')


      // if (!this.isProviderLoggedIn) {
      //   this.$router.push('/provider-form')
      // } else {
      //   this.$router.push('/provider-panel')
      // }

      // if (this.userId === this.providerId) {
      //   this.$router.push('/provider-form')
      // } else {
      //   this.$router.push('/provider-panel')
      // }
    },
    userCurrentLocation () {
      // const watchId = navigator.geolocation.watchPosition(position => {
      //   const { latitude, longitude } = position.coords;
      //   // Show a map centered at latitude / longitude.
      //   console.log("Position lat: " + position.coords.latitude)
      //   console.log("Position lng: " + position.coords.longitude)
      //   this.showUserLocationOnTheMap(position.coords.latitude, position.coords.longitude)
      // });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          // Show a map centered at latitude / longitude.
          this.myLat = latitude
          this.myLng = longitude

          this.showUserLocationOnTheMap (latitude, longitude)
        });
      }

    },

    pinSymbol(color) {
      return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1
      };
    },

    async showUserLocationOnTheMap (latitude, longitude) {

      try {
        await new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: new google.maps.LatLng(latitude, longitude),
          // zoomControl: true,
          // scaleControl: true,
          // fullscreenControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          accuracy: 50,

        });

      } catch(err) {
        console.log("Maps are not loaded successfully!")
      }


      // new google.maps.Marker({
      //   icon: 'http://maps.google.com/mapfiles/ms/icons/white-dot.png',
      //   position: new google.maps.LatLng(latitude, longitude),
      //   accuracy: 50,
      //   map: map
      // })

      // Oma asukoha marker

      // new google.maps.Marker({
      //   position: new google.maps.LatLng(latitude, longitude),
      //   accuracy: 50,
      //   map: map,
      //   icon: this.pinSymbol('yellow'),
      //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
      // })


    },

    getAddressFrom (lat, long) {
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

              // new google.maps.Marker({
              //   position: new google.maps.LatLng(lat, long),
              //   accuracy: 50,
              //   map: map,
              //   icon: this.pinSymbol('yellow'),
              //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
              // })

              //this.address = response.data.results[0].formatted_address
              console.log(response.data.results.results[0].formatted_address)
            }

          })
          .catch(error => {
            this.error = error.message
            console.log(error.message)
          })
    },

    distanceBtw (originLat, originLng, destLat, destLng) {
      var origin = new google.maps.LatLng(originLat, originLng);
      var destination = new google.maps.LatLng(destLat, destLng);
      return (google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000).toFixed(2);
    },

    otherUserLocations (recipients, profession, dist) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        center: new google.maps.LatLng(this.myLat, this.myLng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      // function removeDuplicates(arr) {
      //   return [...new Set(arr.user)];
      // }
      //
      // console.log("answer " + removeDuplicates(recipients).length);
      // let uniqueChars = recipients.filter((element, index) => {
      //   return recipients.indexOf(element.user) === index;
      // });
      //
      // console.log("Un item" + uniqueChars.length);
      console.log("Users count: " + recipients.length);
      console.log("Current distance " + dist)
      // new google.maps.Marker({
      //   position: new google.maps.LatLng(this.myLat, this.myLng),
      //   accuracy: 50,
      //   map: map,
      //   icon: this.pinSymbol('yellow'),
      //   label: { color: '#00aaff', fontWeight: 'bold', fontSize: '14px', text: 'Olen tällä' }
      // })

      let count = 0;
      if (recipients.length > 0) {
        let recipientCount = [];
        for (let pos = 0; pos < recipients.length; pos++) {

          //console.log("Client latitude: " + recipient[pos].latitude)
          //console.log("Client longitude: " + recipient[pos].longitude)

          recipients[pos].professional.forEach(prof => {
            if (prof === profession) {
              //this.countOfSelectedClient++;
              console.log("Distance btw " + this.distanceBtw(this.myLat, this.myLng, recipients[pos].latitude, recipients[pos].longitude));
              this.isActiveClients = true;
              // Removing same user bookings with same profeccional to display only one user
              if (!recipientCount.includes(recipients[pos].user))
               recipientCount.push(recipients[pos].user);

              //count = recipientCount.length;



              if (this.distanceBtw(this.myLat, this.myLng, recipients[pos].latitude, recipients[pos].longitude) <= dist) {
                //count ++;
                count = recipientCount.length;
                new google.maps.Marker({
                  position: new google.maps.LatLng(recipients[pos].latitude, recipients[pos].longitude),
                  map: map
                })
              }

            }
          })

        }

        if (count > 0) {
          this.isActiveClients = true;
        } else {
          this.isActiveClients = false;
        }
        this.countOfSelectedClients = count;
        this.identifyClientText();
        //console.log("Count " + this.countOfSelectedClients)

      }

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


      const recipients = await recipientService.getRecipients()
      if (recipients !== null) {
        this.otherUserLocations(recipients, profession, dist);
        // recipients.forEach(booker => {
        //   if (booker.professional[0] === profession) {
        //     this.otherUserLocations(recipients, profession, dist);
        //   }
        // })

      }
      // visibility: hidden;

    },
    identifyClientText () {
      console.log("Klientide arv: " + this.countOfSelectedClients)
      if (this.countOfSelectedClients > 1) {
        this.client = "asiakasta"
      } else {
        this.client = "asiakas"
      }
    }

  }
}
</script>

<style>
.ui.button,
.dot.circle {
  background-color: #ff5a5f;
  color: white;
}
.proSelectAddress {
  background-color: #575656;
  padding: 13px 13px 0 13px;
  width: 30%;
}
.pro-map-panel {
  background-color: #575656;
  width: 30%;
  margin: auto;
  padding: 13px;
  float: right;
}

.pro-map-panel input {
  color: red;
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
  margin-top: 100px;
}
/*#map {background: transparent url(/src/assets/Loading_icon.gif) no-repeat center center;}*/

#map {
  background: url(/src/assets/map.gif)  no-repeat center center;
  position: absolute;
  top: 50px;
  right: 0;
  bottom: 0;
  left: 0;
 }

@media only screen and (max-width: 1000px) {
  #address_input {
    display: none !important;
  }
  .pro-map-panel {
    background-color: #575656;
    width: 80%;
    margin: auto;
    padding: 13px;
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

</style>