const Promise            = require('bluebird');
const AccountsCollection = require('./schemas/account');
const ObjectId           = require('mongoose').Types.ObjectId;

function AccountModel() {

}

AccountModel.prototype.parseXLSX = function (binary) {
        return new Promise((resolve, reject) => {
                let xlsx               = require('xlsx');
                const workbook         = xlsx.read(binary, {type: 'binary'});
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet        = workbook.Sheets[first_sheet_name];
                let promises           = [];

                let current_row = 2;
                while (!!worksheet['A' + current_row]) {
                        let account = {};
                        // account.oe     = worksheet['A' + current_row].v;
                        account.oemNumber   = worksheet['B' + current_row].v;
                        account.modelName   = worksheet['C' + current_row].v;
                        account.name        = worksheet['D' + current_row].v;
                        account.unit        = worksheet['E' + current_row].v;
                        account.description = worksheet['F' + current_row].v;
                        promises.push(this.addAccount(account));

                        current_row++;
                }

                Promise.all(promises).then(data => {
                        resolve(data);
                }).catch(err => {
                        reject(err);
                });
        });
};

AccountModel.prototype.addAccount    = function (accountObject) {
        return new Promise((resolve, reject) => {
                if (!accountObject.store) {
                        reject("store property is mandatory!");
                }
                accountObject.store = ObjectId(accountObject.store);
                let account = new AccountsCollection(accountObject);
                account.count = 1;
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
AccountModel.prototype.balance       = function (query = {}) {
        return new Promise((resolve, reject) => {
                AccountsCollection.find(query, function (err, accounts) {
                        if (!err) {
                                resolve(accounts);
                        } else {
                                reject(err);
                        }
                });
        });

};

AccountModel.prototype.soldBalance = function (query) {
        query.count = 0;
        return new Promise((resolve, reject) => {
                AccountsCollection.find(query, function (err, accounts) {
                        if (!err) {
                                resolve(accounts);
                        } else {
                                reject(err);
                        }
                });
        });
};

module.exports = new AccountModel();