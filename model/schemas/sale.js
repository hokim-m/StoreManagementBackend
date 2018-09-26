const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
let SaleSchema = new Schema({
        account: {type: ObjectId, ref: 'accounts'},
        count: Number,
        clientId: {type: ObjectId, ref: 'customers'},
        overallSum: Number,
        storeId: ObjectId,
        timestamp: Number,
        user: ObjectId
}, {
        versionKey: false
});



let SaleCollection = mongoose.model('sale', SaleSchema);
module.exports     = SaleCollection;