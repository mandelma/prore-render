const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    booking: {
        month: {
            type: Number
        },
        day: {
            type: Number
        },
        hours: {
            type: Number
        },
        minutes: {
            type: Number
        }
    }


})

bookingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const booking = mongoose.model('booking', bookingSchema)

module.exports = booking;