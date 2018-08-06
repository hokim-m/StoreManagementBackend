const Promise            = require('bluebird');
const AccountsCollection = require('./schemas/account');

function AccountModel() {

}

AccountModel.prototype.parseXLSX = function () {

};

AccountModel.prototype.addAccount = function (accountObject) {
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

AccountModel.prototype.balance = function (query) {
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
        return new Promise((resolve, reject)=> {
                AccountsCollection.find({count: 0}, function (err, accounts) {
                        if (!err) {
                                resolve(accounts);
                        } else {
                                reject(err);
                        }
                })
        })
};

module.exports = new AccountModel();