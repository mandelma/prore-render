class Messages {
    constructor () {
        this.messages = [];
        this.room = "";
    }
    addMessage (room, username, content) {
        const message = {room, username, content};
        this.room = room;
        this.messages.push(message);
        return message;
    }

    getRoom () {
        return this.room;
    }

    getRoomMessages (room) {
        return this.messages.filter(message => message.room === room);
    }
}

module.exports = Messages;