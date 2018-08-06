const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
        login: String,
        name: String,
        group: Number,
        store: Schema.Types.ObjectId,
        hash: String
}, {
        versionKey: false
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
