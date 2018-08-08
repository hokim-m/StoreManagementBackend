const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
        name: String,
        description: String,
        phoneNumber: String,
        address: String,
        timestamp: Number
}, {
        versionKey: false
});

let CustomersModel = mongoose.model('customer', CustomerSchema);
module.exports = CustomersModel;