const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imgSchema = new Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    image: {
        type: String
    },
    name: {
        type: String
    },
    size: {
        type: String
    },
    recipient:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipient'
        }


     },
    {
    collection: 'Images'
})


module.exports = mongoose.model('image', imgSchema)