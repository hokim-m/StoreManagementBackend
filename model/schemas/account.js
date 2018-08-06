const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let AccountSchema = new Schema({
        name: String,
        count: Number,
        group: String,
        description: String,
        imageLink: String,
        unit: String,
        source: String,
        price: String,
        oemNumber: String,
        modelName: String

}, {
        versionKey: false
});

let AccountModel = mongoose.model('accounts', AccountSchema);
module.exports   = AccountModel;