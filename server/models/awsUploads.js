const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    created: {
        type: Date,
        default: new Date()
    },
    imageUrl: {
        type: String
    },
    key: {type: String},
    recipient:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipient'
        }

})

module.exports = mongoose.model('upload', uploadSchema)

