import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection(token) {
        this.socket = io('http://localhost:3002', {
            auth: {
                token,
            },
            withCredentials: true,
            transports: ['websocket']
        });
        console.log(`Connecting socket...`);


        this.socket.on('my broadcast', (data) => {
            console.log("conn data " + data);
        });
    }

    subscribeToMessages(cb) {
        if (!this.socket) return(true);
        this.socket.on('message', msg => {
            console.log('Room event received!');
            return cb(null, msg);
        });
    }

    sendMessage({message, roomName}, cb) {
        if (this.socket) this.socket.emit('message', { message, roomName }, cb);
    }

    disconnect() {
        if(!this.socket) {
            this.socket.disconnect();
        }
    }
}


export default new SocketioService();