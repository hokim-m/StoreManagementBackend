const Promise = require('bluebird');
const CustomersCollection = require('./schemas/customer');
const ObjectId = require('mongoose').Types.ObjectId;

function CustomerModel() {

}


CustomerModel.prototype.add = function (customer) {
        return new Promise((resolve, reject)=> {
                customer.timestamp = (new Date()).getTime();
                let customerObj = new CustomersCollection(customer);
                customerObj.save((err, onSave)=> {
                        if (!err) resolve(onSave);
                        else reject(err);
                })
        })
};

CustomerModel.prototype.edit = function (customerID, customer) {
        return new Promise((resolve, reject)=> {
                let updatingObj = {$set: {}};
                Object.keys(customer).map(key=> {
                        updatingObj['$set'][key] = customer[key];
                });
                CustomersCollection.update({
                        _id: ObjectId(customerID)
                }, updatingObj, function (err, result) {
                        if (!err) resolve(result);
                        else reject(err);
                })
        });
};

CustomerModel.prototype.remove = function (customerID) {
        return new Promise((resolve, reject)=> {
                CustomersCollection.remove({_id: ObjectId(customerID)}, function (err, result) {
                        if (!err) resolve(result);
                        else reject(err);
                })
        })
};

CustomerModel.prototype.list = function (query) {
        return new Promise((resolve, reject)=> {
                CustomersCollection.find(query, function (err, result) {
                        if (!err) resolve(result);
                        else reject(err);
                })
        })
};

module.exports = new CustomerModel();