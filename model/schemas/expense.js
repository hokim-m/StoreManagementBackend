const mongoose = require('mongoose');
const Schema   = require('mongoose').Schema;

let ExpenseSchema = new Schema({
        amount: Number,
        description: String,
        timestamp: Number
}, {
        versionKey: false
});

let ExpenseCollection = mongoose.model('expenses', ExpenseSchema);
module.exports        = ExpenseCollection;
