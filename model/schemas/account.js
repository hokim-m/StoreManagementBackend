const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let AccountSchema = new Schema({
        name: String,
        count: Number,
        unit: String,
        comment: String,
        source: String,
        oemNumber: String,
        modelName: String

}, {
        versionKey: false
});

let AccountModel = mongoose.model('accounts', AccountSchema);
module.exports   = AccountModel;