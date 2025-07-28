const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fcmSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    fcmTokens: { type: [String], default: [] }, // Array of tokens for multiple devices
})

fcmSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const fcmUsers = mongoose.model('fcm_user', fcmSchema);
module.exports = fcmUsers