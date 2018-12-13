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
        price: Number,
        oemNumber: String,
        createdTimestamp: Number,
        timestamp: Number,
        model: String,
        status: Number, //-2 Created instance, Moderator check is necessary, -1 Moderator approved, Added admin need to check, 0 Admin moderated ready to use
        store: Schema.Types.ObjectId,

}, {
        versionKey: false
});

let AccountModel = mongoose.model('accounts', AccountSchema);
module.exports   = AccountModel;