import { io } from "socket.io-client";

//const URL = "http://localhost:3001";
//const URL = "https://line-app-pro.onrender.com/"
//const URL = "https://prokeikkatori-f43699030e18.herokuapp.com/"

let URL = "";

// if (process.env.NODE_ENV === 'production') {
//     //console.log('Production mode enabled');
//     URL = "https://prokeikkatori-f43699030e18.herokuapp.com/"
// } else {
//     //console.log('Development mode enabled');
//     URL = "http://localhost:3001";
// }

if (process.env.NODE_ENV === 'production') {
    if (process.env.RENDER === 'true') {
        console.log("App is in Render");
        URL = "https://line-app-pro.onrender.com"
        //app.use(express.static('dist'))
    } else if (process.env.DYNO) {
        console.log("App is in heroku");
        URL = "https://prokeikkatori-f43699030e18.herokuapp.com/"
    }
} else {
    console.log('Local or unknown platform');
    URL = "http://localhost:3001";
}

//const socket = io(URL, { autoConnect: false });

const connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    "transports": ["websocket"]
};

// aaa

const socket = io.connect(URL, connectionOptions);

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;