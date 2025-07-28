const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    yritys: {
        type: String
    },
    ytunnus: {
        type: String
    },
    created: {
        type: Date
    },
    username: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,

    },
    isOnline: {

        type: Boolean
    },

    avatar: {
        type: Object
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'msg'
        }
    ],
    passwordHash: {
        type: String
    },
    tokenReset: {
        type: String
    },
    // history_about_pro: {
    //     type: mongoose.Schema.Types.ObjectID,
    //     ref: 'pro_history'
    // },
    // history_about_client: {
    //     type: mongoose.Schema.Types.ObjectID,
    //     ref: 'client_history'
    // }

    // provider: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'provider'
    // },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('user', userSchema)
module.exports = User