<template>
  <div>
    <h1>User location page</h1>
    <section class="ui two column centered grid" style="position: relative; z-index:1;">
      <div class="column">
        <form class="ui segment large form">
          <div class="ui message red" v-show="error">{{error}}</div>
          <div class="ui segment">
            <div class="field">
              <div class="ui right icon input large" :class="{loading:spinner}">
                <input
                    type="text"
                    placeholder="Enter your address:"
                    v-model="address"
                    id="autocomplete"
                />
                <i class="dot circle link icon" @click="locatorButtonPressed"></i>
              </div>
            </div>
            <button class="ui button" @click="testPlace">Go</button>
          </div>
        </form>
      </div>

    </section>
    <section id="map"></section>
  </div>
</template>

<script>
/* eslint-disable */
/*global google*/
import axios from 'axios'
//import key from '@/config/keys'
const key = require('../../server/config/keys')
export default {
  name: "user-location",
  data () {
    return {
      address: "",
      error: "",
      spinner: false,
      lat: "",
      lng: ""
    }
  },
  mounted () {
    // &callback=Function.prototype
    //document.getElementById("autocomplete")

    const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const input = document.getElementById("autocomplete");
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "fi" },
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
      //types: ["establishment"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace()
      this.lat = place.geometry.location.lat()
      this.lng = place.geometry.location.lng()

      console.log(place)
      this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
    })


    // let autocomplete =  new google.maps.places.Autocomplete (
    //   document.getElementById("autocomplete"),
    //   {
    //     bounds: new google.maps.LatLngBounds(
    //         new google.maps.LatLng(61.92411, 25.748151)
    //     )})
    // autocomplete.addListener("place_changed", () => {
    //   let place = autocomplete.getPlace();
    //   console.log(place)
    //   this.showUserLocationOnTheMap(place.geometry.location.lat(), place.geometry.location.lng())
    // })
  },
  methods: {
    test () {
      console.log("Key is: " + key.googleMap)
    },
    locatorButtonPressed () {
      this.spinner = true
      console.log("Google maps test")
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
          this.getAddressFrom(position.coords.latitude, position.coords.longitude)
          console.log("pos latitude: " + position.coords.latitude)
          console.log("Pos longitude: " + position.coords.longitude)
              this.showUserLocationOnTheMap (
                  position.coords.latitude,
                  position.coords.longitude
              );
        },


            error => {
              this.error = "Locator is unable to find your address. Please type your address!"
              console.log("Error" + error)
              this.spinner = false;
          //console.log("Error: " + error.message)
            }
        )
      } else {
        //this.error = error.message
        console.log("Your Browser does not support geolocation API")
      }
    },
    getAddressFrom (lat, long) {
      axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +
          "," + long
          + "&key=" + key.googleMap)
          .then(response => {
            if (response.data.error_message) {
              this.error = response.data.error_message;
              this.spinner = false;
              console.log(response.data.error_message)
            } else {
              this.address = response.data.results[0].formatted_address
              console.log(response.data.results.results[0].formatted_address)
            }

      })
      .catch(error => {
        this.error = error.message
        this.spinner = false;
        console.log(error.message)
      })
    },
    showUserLocationOnTheMap (latitude, longitude) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map
      })
    },
    testPlace () {
      console.log("Lat: " + this.lat)
      console.log("Lng: " + this.lng)
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
}#map {
   position: absolute;
   top: 50px;
   right: 0;
   bottom: 0;
   left: 0;
 }


</style>