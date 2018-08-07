const Promise         = require('bluebird');
const StoreCollection = require('./schemas/store');
const ObjectId        = require('mongoose').Types.ObjectId;

function StoreModel() {

}

StoreModel.prototype.add    = function (storeObject) {
        return new Promise((resolve, reject) => {
                if (!storeObject.title) {
                        return reject('property `title` is required!');
                }
                if (storeObject.parent) {
                        storeObject.parent = ObjectId(storeObject.parent);
                }
                let store = new StoreCollection(storeObject);
                store.timestamp = (new Date()).getTime();
                store.save((err, onSave) => {
                        if (!err) {
                                if (onSave.parent) {
                                        this.addSub(onSave.parent, onSave).then(data=> {
                                                resolve(data);
                                        }).catch(err=> {
                                                reject(err);
                                        });
                                } else {
                                        resolve(onSave);
                                }

                        } else {
                                reject(err);
                        }
                });
        });
};
StoreModel.prototype.addSub = function (parentId, store) {
        return new Promise((resolve, reject) => {
                StoreCollection.update({
                        _id: parentId
                }, {$push: {sub: store._id}}, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};
StoreModel.prototype.removeFromSub = function (store) {
        return new Promise((resolve, reject) => {
                StoreCollection.update({
                }, {$pull: {sub: store._id}}, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};
StoreModel.prototype.edit   = function (storeId, storeObject) {
        return new Promise((resolve, reject) => {
                let updatingKeys = {$set: {}};
                Object.keys(storeObject).map(key => {
                        updatingKeys['$set'][key] = storeObject[key];
                });
                StoreCollection.update({
                        _id: ObjectId(storeId)
                }, updatingKeys, function (err, result) {
                        console.log(err);
                        console.log(result);
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

                StoreCollection.remove({_id: ObjectId(storeId)}, (err, result)=> {
                        if (!err) {
                                this.removeFromSub({_id: ObjectId(storeId)});
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};

StoreModel.prototype.list = function () {
        return new Promise((resolve, reject) => {
                StoreCollection.find({parent: null})
                    .populate('sub')
                    .exec(function (err, result) {
                            if (!err) {
                                    resolve(result);
                            } else {
                                    reject(err);
                            }
                    });
        });
};


module.exports = new StoreModel();