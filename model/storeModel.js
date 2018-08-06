const Promise         = require('bluebird');
const StoreCollection = require('./schemas/store');
const ObjectId        = require('mongoose').Types.ObjectId;

function StoreModel() {

}

StoreModel.prototype.add = function (storeObject) {
        return new Promise((resolve, reject) => {
                if (!storeObject.title) {
                        return reject('property `title` is required!');
                }
                let store = new StoreCollection(storeObject);
                store.save((err, onSave) => {
                        if (!err) {
                                resolve(onSave);
                        } else {
                                reject(err);
                        }
                });
        });
};

StoreModel.prototype.edit = function (storeId, storeObject) {
        return new Promise((resolve, reject) => {
                let updatingKeys = {$set: {}};
                Object.keys(storeObject).map(key => {
                        updatingKeys['$set'][key] = storeObject[key];
                });
                StoreCollection.update({
                        _id: ObjectId(storeId)
                }, updatingKeys, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};

StoreModel.prototype.remove = function (storeId) {
        return new Promise((resolve, reject) => {
                try {
                        ObjectId(storeId);
                } catch (e) {
                        reject('Incorrect ObjectId representation');
                }

                StoreCollection.remove({_id: ObjectId(storeId)}, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};

StoreModel.prototype.list = function () {
        return new Promise((resolve, reject) => {
                StoreCollection.find({}, function (err, list) {
                        if (!err) {
                                resolve(list);
                        } else {
                                reject(err);
                        }
                })
        });
};


module.exports = new StoreModel();