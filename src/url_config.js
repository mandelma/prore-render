import { Capacitor } from '@capacitor/core';

let backendUrl = "";
//const isDevTestingOnAndroid = true;
if (Capacitor.isNativePlatform()) {
    if (process.env.NODE_ENV === 'development') {
        backendUrl = "http://10.0.2.2:3001/api"
    } else {
        backendUrl = "https://www.prokeikkatori.fi/api"
    }

    // http://10.0.2.2:3001/api
    // if (isDevTestingOnAndroid) {
    //     backendUrl = "http://10.0.2.2:3001/api";  // force local server
    // } else {
    //     backendUrl = "https://www.prokeikkatori.fi/api";
    // }
} else {
    backendUrl = "/api"
}

export default backendUrl ;