const app = require("express")();
//const http = require("http").Server(app);

const port = 3009;

var http = require('http');
var server = http.createServer(app);
server.listen(process.env.PORT || '3011', function () {
    console.log('New server listens on port 3011');
});

const io = require("socket.io")(http, {
    cors: {

        //origin: 'http://localhost:8080',
        origin: '*',
        //origin: '*',
        // methods: ["GET", "POST"],
        // transports: ['websocket'],

        credentials: true,
        // origins: [
        //     'http://localhost:8080'
        //  //   '*'
        // ]
    },
    allowEIO3: true,


});

io.listen(server);


const mongoose = require("mongoose");
const cors = require('cors');
const Msg = require('./models/chatMessages')

const Users = require('./utils/UsersClass')
let users = [];
let messages = [];
// 27017
// "mongodb://localhost:127001/chatdb"

// const corsOptions ={
//     //origin: true,
//     origin: 'http://localhost:8080',
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
// }

// test

app.use(cors())

const userRouter = require('./routers/users')
const loginRouter = require('./routers/login')
const provideRouter = require('./routers/providers')
const recipientRouter = require('./routers/recipients')
const mapRouter = require('./routers/maps')
const bookingRouter = require('./routers/calendarBookings')
const timeOfferRouter = require('./routers/calendarOffers')
const uploadRouter = require('./routers/images')
const chatRouter = require('./routers/chat')
const messageRouter = require('./routers/messages')



app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/providers', provideRouter);
app.use('/api/recipients', recipientRouter);
app.use('/api/map', mapRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/offers', timeOfferRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/agora', chatRouter);
app.use('/api/messages', messageRouter);

// server.listen(process.env.PORT || '3000', function () {
//     console.log('server listens on port 3000');
// });
// var io = require('socket.io')(http);
// io.listen(server);
//
//
// var server = app.listen(port);
// var io = socket(server);


// ddd
mongoose.connect( "mongodb://127.0.0.1/chatdb", {useNewUrlParser: true, useUnifiedTopology: true});

const ChatSchema = mongoose.Schema({
    username: String,
    msg: String,
});

const UserSchema = mongoose.Schema({
    userID: String,
    room: String,
    username: String,
    connected: Boolean
})

const UserModel = mongoose.model("chat-user", UserSchema);


const crypto = require("crypto");

const randomId = () => crypto.randomBytes(8).toString("hex");

const userList = new Users();

app.get('/', (req,res) => {
    res.send("Hello from server")
})

// aaa
const initMessages = async () => {
    await Msg.find((err, res) => {
        if (err) throw err
        //socket.emit("init messages", res)
        messages = res;
    })
}

// sss

let room = ""

const initUsers = async (room) => {
    await UserModel.find({room: room})
        .then(user => {
            console.log("Users++  " + user)
            users = user;
        })

}

// UserModel.find({room: "vantaa"})
//     .then(user => {
//         console.log("Users++  " + user)
//         users = user;
//     })



console.log("xxx " + room)

Msg.find()
    .then((result) => {

        console.log("User message: " + result)
        //messages.push(result);
        messages = result;
    })

// aaa
io.on("connection", (socket) => {
    socket.emit("loggedIn", {
        users: users.map((s) => s.username),
        messages: messages,
    });

    socket.on("new user", (username) => {
        socket.username = username;

        users.push(socket);

        io.emit("userOnline", socket.username);
    });

    socket.on("msg", (msg) => {
        let message = new ChatModel({
            username: socket.username,
            msg: msg,
        });

        message.save((err, result) => {
            if (err) throw err;

            messages.push(result);

            io.emit("msg", result);
        });
    });

    socket.on("disconnect", () => {
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    });
});

// http.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });


module.exports = app