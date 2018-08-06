const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UploadHistorySchema = new Schema({
        title: String,
        filePath: String,
        timestamp: Number,
        user: Schema.Types.ObjectId,
        store: Schema.Types.ObjectId
}, {
        versionKey: false
});


const UploadHistoryModel = mongoose.model('uploadHistory', UploadHistorySchema);
module.exports = UploadHistoryModel;