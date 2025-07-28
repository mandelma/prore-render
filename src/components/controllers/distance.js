/*global google*/

// if (!window.google) {
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&libraries=places,geometry`;
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);
//     console.log("Map is inited in distance!");
// }

const getDistanceMatrix = (service, data) => new Promise((resolve, reject) => {
    service.getDistanceMatrix(data, (response, status) => {
        if(status === 'OK') {
            resolve(response)
        } else {
            reject(response);
        }
    })
});
const findDistance = async (start, end) => {
    try {
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

        return {
            distance: (result.rows[0].elements[0].distance.value / 1000).toFixed(1),
            duration: result.rows[0].elements[0].duration.text
        };
    } catch (err) {
        console.log("Error to find distance!!")
    }

};



let res = "";
const distance = () => {
    //let text = "";
    //let value = 0;
    var origin = new google.maps.LatLng(60.233093,24.7531362);
    var destination = new google.maps.LatLng(60.2767265,24.8575089);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            durationInTraffic: true,
            avoidHighways: false,
            avoidTolls: false
        }, response_data);
    //return response_data;
}

const response_data = (responseDis, status) => {
    //let result = "";
    if (status !== google.maps.DistanceMatrixStatus.OK || status !== "OK"){
        console.log('Error:', status);
        // OR
        alert(status);
    }else{
        //alert(responseDis.rows[0].elements[0].distance.text);
        console.log("Distance " + responseDis.rows[0].elements[0].distance.text)

        res = responseDis.rows[0].elements[0].distance.text;
        return "aaaaaaaaaaaaa"
        //result = responseDis.rows[0].elements[0].distance.text;
    }
    //return  "Hallo"        //result.toString();
}

const test = () => {
    console.log("Is it working??" + res)

    return  <div>Hiiii</div>;
}

const theDist = () => {
    var origin = new google.maps.LatLng(60.233093,24.7531362);
    var destination = new google.maps.LatLng(60.2767265,24.8575089);
    return (google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000).toFixed(2);
}

// function calcDistance() {
//     // var origin = new google.maps.LatLng(60.233093,24.7531362);
//     // var destination = new google.maps.LatLng(60.2767265,24.8575089);
//     // return (google.maps.geometry.spherical.computeDistanceBetween(origin, destination) / 1000).toFixed(2);
//
//     var directionsService = new google.maps.DirectionsService();
//
//     var request = {
//         origin      : 'Melbourne VIC', // a city, full address, landmark etc
//         destination : 'Sydney NSW',
//         travelMode  : google.maps.DirectionsTravelMode.DRIVING
//     };
//
//     directionsService.route(request, function(response, status) {
//         if ( status === google.maps.DirectionsStatus.OK ) {
//             alert( response.routes[0].legs[0].distance.value ) ; // the distance in metres
//         }
//         else {
//             // oops, there's no route between these two locations
//             // every time this happens, a kitten dies
//             // so please, ensure your address is formatted properly
//         }
//     });
// }

export default { findDistance, distance, test, theDist }