const Promise            = require('bluebird');
const AccountsCollection = require('./schemas/account');
const SalesCollection    = require('./schemas/sale');

const ObjectId = require('mongoose').Types.ObjectId;

function AccountModel() {

}

AccountModel.prototype.parseXLSX = function (binary, store) {
        return new Promise((resolve, reject) => {
                let xlsx                    = require('xlsx');
                const workbook              = xlsx.readFile(binary.path);
                const first_sheet_name      = workbook.SheetNames[0];
                const worksheet             = workbook.Sheets[first_sheet_name];
                let promises                = [];
                let worksheetValueOrDefault = (primary, secondary) => {
                        if (!primary) return secondary;
                        return primary.v;
                };
                let current_row             = 6;
                while (!!worksheet['A' + current_row]) {
                        let account         = {};
                        // account.oe     = worksheet['A' + current_row].v;
                        account.oemNumber   = worksheetValueOrDefault(worksheet['B' + current_row], '');
                        account.modelName   = worksheetValueOrDefault(worksheet['C' + current_row], '');
                        account.name        = worksheetValueOrDefault(worksheet['D' + current_row], '');
                        account.unit        = worksheetValueOrDefault(worksheet['E' + current_row], '');
                        account.description = worksheetValueOrDefault(worksheet['F' + current_row], '');
                        account.store       = store;
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
                        reject('store property is mandatory!');
                }
                accountObject.store = ObjectId(accountObject.store);
                let account         = new AccountsCollection(accountObject);
                if (!account.count) {
                        account.count = 1;
                }
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
                let count  = accountObject.count;
                let client = accountObject.clientId;
                let user   = accountObject.userId;
                AccountsCollection.findOne({_id: ObjectId(accountId)}, function (err, account) {
                        if (!err) {
                                let nAccount   = Object.assign({}, account);
                                nAccount.count = count;
                                account.count -= count;
                                account.save((err, onSave) => {
                                        console.log(err);
                                        console.log(onSave);
                                });
                                let sale        = new SalesCollection();
                                let overalSum   = Number(account.price) * Number(count);
                                sale.account    = account._id;
                                sale.clientId   = ObjectId(client);
                                sale.user       = ObjectId(user);
                                sale.count      = count;
                                sale.store      = nAccount.store;
                                sale.timestamp  = new Date().getTime();
                                sale.overallSum = isNaN(overalSum) ? 0 : Number(overalSum);
                                sale.save((err, onSave) => {
                                        resolve(onSave);
                                });
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
                                let existingAccounts = [];
                                for (let i = 0; i < accounts.length; i++) {
                                        let cAccount = accounts[i];
                                        if (cAccount.count > 0) {
                                                existingAccounts.push(cAccount);
                                        }
                                }
                                resolve(existingAccounts);
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
AccountModel.prototype.search      = function (search) {
        return new Promise((resolve, reject) => {
                AccountsCollection.aggregate([
                        // Project things as a key/value array, along with the original doc
                        {
                                $project: {
                                        array: {$objectToArray: '$things'},
                                        doc: '$$ROOT'
                                }
                        },

                        // Match the docs with a field value of 'red'
                        {$match: {'array.v': /.*son.*/i}},

                        // Re-project the original doc
                        {$replaceRoot: {newRoot: '$doc'}}
                ], function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};

AccountModel.prototype.reports     = function (store = 'all', from, to, client = 'all') {
        return new Promise((resolve, reject) => {
                let matchingObject = {$match: {timestamp: {$gte: from, $lte: to}}};
                if (store !== 'all') {
                        matchingObject['$match'].store = ObjectId(store);
                }
                if (client !== 'all') {
                        matchingObject['$match'].clientId = ObjectId(client);
                }
                let accountLookUp = {
                        $lookup: {
                                from: 'accounts',
                                localField: 'account',
                                foreignField: '_id',
                                as: 'account'
                        }
                };
                let clientLookUp  = {
                        $lookup: {
                                from: 'customers',
                                localField: 'clientId',
                                foreignField: '_id',
                                as: 'customer'
                        }
                };
                let accountMerge  = {$unwind: '$account'};
                let clientMerge   = {$unwind: '$customer'};
                
                SalesCollection.aggregate([matchingObject, clientLookUp, clientMerge, accountLookUp, accountMerge], function (err, result) {
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
AccountModel.prototype.reportsXLSX = function (store = 'all', from, to) {
        return new Promise((resolve, reject) => {
                let matchinObject = {$match: {timestamp: {$gte: from, $lte: to}}};
                if (store !== 'all') {
                        matchinObject['$match'].store = ObjectId(store);
                }
                AccountsCollection.aggregate([matchinObject], function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                reject(err);
                        }
                });
        });
};
module.exports                     = new AccountModel();