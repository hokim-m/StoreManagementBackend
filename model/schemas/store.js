const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StoreSchema = new Schema({
        title: String,
        group: String, //main, sub
        description: String,
        timestamp: Number
}, {
        versionKey: false
});

const StoreModel = mongoose.model('store', StoreSchema);

module.exports = StoreModel;