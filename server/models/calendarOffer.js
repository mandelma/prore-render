const mongoose = require('mongoose')
const Schema = mongoose.Schema

const offerRangeSchema = new Schema({
    yearFrom: {
        type: Number
    },
    monthFrom:{
        type: Number
    },
    dayFrom: {
        type: Number
    },
    hoursFrom: {
        type: Number
    },
    minutesFrom: {
        type: Number
    },
    yearTo: {
        type: Number
    },
    monthTo: {
        type: Number
    },
    dayTo: {
        type: Number
    },
    hoursTo: {
        type: Number
    },
    minutesTo: {
        type: Number
    },


    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider'
    },
})

offerRangeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Timeoffer = mongoose.model('timeoffer', offerRangeSchema)

module.exports = Timeoffer;