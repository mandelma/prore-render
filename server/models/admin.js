const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    completed: {
        profession: {
            type: String,
        },
        date: {
            type: Date
        }

    },

})

adminSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;