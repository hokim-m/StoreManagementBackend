const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
let StoreSchema = new Schema({
        title: String,
        description: String,
        parent: ObjectId,
        timestamp: Number
}, {
        versionKey: false
});

const StoreModel = mongoose.model('store', StoreSchema);

module.exports = StoreModel;