/*global google*/

import axios from "axios";
//import key from "../../server/config/keys";

let myLat;
let myLng;

let id;

let clientCount = 0;

export default {
    clientCount,

    mapData (mId) {
        id = mId
    },

    getMapId () {
       console.log("id is " + id)
    },




    geolocationSuccess (pos) {
        console.log("Geo latitude- " + pos.coords.latitude)
        console.log("Geo longitude- " + pos.coords.longitude)

        myLat = pos.coords.latitude
        myLng = pos.coords.longitude

        let map = new google.maps.Map(document.getElementById(id), {
            zoom: 13,
            center: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP

        });
        new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map
        })

    },
    geolocationError (err) {
        console.log("Error here: " + err.message)
    },

    async userCurrentPosition () {
        if (navigator.geolocation) {
            await navigator.geolocation.getCurrentPosition(
                this.geolocationSuccess,
                this.geolocationError, {
                    timeout: 10,
                    enableHighAccuracy: true,
                    maximumAge: Infinity,
                    accuracy: 10
                }

            );
        } else {
            console.log("Not working")
        }

    },


    getAddressFrom (lat, long) {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat +
            "," + long
            + "&key=" + 'AIzaSyBDA2EBoGezJx51wQtxoW3Ecq5Ql8CCAiE')
            .then(response => {
                if (response.data.error_message) {
                    this.error = response.data.error_message;

                    console.log(response.data.error_message)
                } else {
                    new google.maps.Map(document.getElementById(id), {
                        zoom: 13,
                        center: new google.maps.LatLng(lat, long),
                        mapTypeId: google.maps.MapTypeId.ROADMAP

                    });
                    // new google.maps.Marker({
                    //     position: new google.maps.LatLng(lat, long),
                    //     map: map
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










    showUserLocationOnTheMap (latitude, longitude, mapId) {
        let map = new google.maps.Map(document.getElementById(mapId), {
            zoom: 13,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            accuracy: 0,

        });
        new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            accuracy: 0,
            map: map
        })
    },

    userCurrentCoords () {
        //let lat;
        //let lng;
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            // Show a map centered at latitude / longitude.
            myLat = latitude;
            myLng = longitude;
            console.log("Lat now " + latitude)
            console.log("Lng now " + longitude)
        });

        //return {latitude: lat, longitude: lng}
    },

    userCurrentLocation (mapId) {
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
                myLat = latitude;
                myLng = longitude;
                console.log("Lat now " + myLat)
                console.log("Lng now " + myLng)
                this.showUserLocationOnTheMap (latitude, longitude, mapId)
            });
        } else {
            console.log("Loading... or error?")
        }

    },
    otherUserLocations (recipients, profession, mapId) {
        let map = new google.maps.Map(document.getElementById(mapId), {
            zoom: 10,
            center: new google.maps.LatLng(myLat, myLng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        console.log("Users count: " + recipients.length)
        clientCount = 0;
        if (recipients.length > 0) {
            for (let pos = 0; pos < recipients.length; pos++) {

                //console.log("Client latitude: " + recipient[pos].latitude)
                //console.log("Client longitude: " + recipient[pos].longitude)

                recipients[pos].professional.forEach(prof => {
                    if (prof === profession) {
                        clientCount += 1
                        new google.maps.Marker({
                            position: new google.maps.LatLng(recipients[pos].latitude, recipients[pos].longitude),
                            map: map
                        })
                    }
                })

            }
            console.log("Client count: " + clientCount)

        }

    },



}

