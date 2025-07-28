const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
    created_ms: {type: Number},
    room: String,
    //content: String,
    // content: [
    //     {
    //         msg_status: {type: String},
    //         body: {type: String}
    //     }
    // ],

    content: {
        msg_status: {type: String},
        body: {type: String}
    },
    imgID: String,
    key: String,
    image: String,
    is_db_image: Boolean,
    username: String,
    date: String,
    userID: String,
    receiverID: String,
    status: String
})

chatMessageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const conversation = mongoose.model('conversation', chatMessageSchema)
module.exports = conversation