const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fbSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        accountId: {
            type: String,
        },
        name: {
            type: String,
            trim: true,
        },
        provider: {
            type: String,
        },
    },
    {
        timestamps: true,

})

fbSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const FbModel = mongoose.model("fbUser", fbSchema);
module.exports = FbModel;