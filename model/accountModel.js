const Promise            = require('bluebird');
const AccountsCollection = require('./schemas/account');
const ObjectId           = require('mongoose').Types.ObjectId;

function AccountModel() {

}

AccountModel.prototype.parseXLSX = function () {

};

AccountModel.prototype.addAccount    = function (accountObject) {
        return new Promise((reject, resolve) => {
                let account = new AccountsCollection(accountObject);
                account.save((err, onSave) => {
                        if (!err) {
                                resolve(onSave);
                        } else {
                                reject(err);
                        }
                });
        });

};
AccountModel.prototype.sellAccount   = function (accountId, accountObject) {
        return new Promise((resolve, reject) => {
                AccountsCollection.update({
                        _id: ObjectId(accountId)
                }, {
                        $set: {
                                count: 0,
                                timestamp: (new Date()).getTime()
                        }
                }, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });

};
AccountModel.prototype.updateAccount = function (accountId, accountObject) {
        return new Promise((resolve, reject) => {
                let updatingObject = {$set: {}};
                Object.keys(accountObject).map(key => {
                        updatingObject['$set'][key] = accountObject[key];
                });

                AccountsCollection.update({
                        _id: ObjectId(accountId)
                }, updatingObject, function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};
AccountModel.prototype.balance       = function (query) {
        return new Promise((resolve, reject) => {
                AccountsCollection.find({}, function (err, accounts) {
                        if (!err) {
                                resolve(accounts);
                        } else {
                                reject(err);
                        }
                });
        });

};

AccountModel.prototype.soldBalance = function (query) {
        return new Promise((resolve, reject) => {
                AccountsCollection.find({count: 0}, function (err, accounts) {
                        if (!err) {
                                resolve(accounts);
                        } else {
                                reject(err);
                        }
                });
        });
};

module.exports = new AccountModel();