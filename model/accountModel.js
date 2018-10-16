const Promise            = require('bluebird');
const AccountsCollection = require('./schemas/account');
const SalesCollection    = require('./schemas/sale');

const ObjectId = require('mongoose').Types.ObjectId;

function AccountModel() {

}

AccountModel.prototype.addImage = function () {
        return new Promise((resolve, reject) => {

        });
};

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
                let count            = accountObject.count;
                let accountCountSell = Number(accountObject.count);
                let client           = accountObject.clientId;
                let user             = accountObject.userId;
                AccountsCollection.findOne({_id: ObjectId(accountId)}, function (err, account) {
                        if (!err) {
                                let nAccount   = Object.assign({}, account);
                                nAccount.count = accountCountSell;
                                account.count -= accountCountSell;
                                account.save((err, onSave) => {
                                        if (err) {
                                                console.log('error selling account');
                                                console.log(err);
                                        }

                                        console.log(onSave);
                                });
                                let sale      = new SalesCollection();
                                let overalSum = Number(account.price) * Number(count);
                                sale.account  = account._id;
                                if (client) {
                                        sale.clientId = ObjectId(client);
                                }
                                sale.user       = ObjectId(user);
                                sale.storeId    = account.store;
                                sale.count      = Number(accountCountSell);
                                sale.timestamp  = new Date().getTime();
                                sale.overallSum = isNaN(overalSum) ? 0 : Number(overalSum);
                                sale.save((err, onSave) => {
                                        if (err) {
                                                console.log('error saving sale');
                                                console.log(err);
                                        }
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
                                AccountsCollection.findOne({_id: ObjectId(accountId)}, function (err, updatedAccount) {
                                        if (!err) {
                                                resolve(updatedAccount);
                                        } else {
                                                reject(err);
                                        }
                                });

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
AccountModel.prototype.search      = function (search = '', store = 'all') {
        return new Promise((resolve, reject) => {
                let matchinObject = {count: {$gt: 0}};
                if (store !== 'all') {
                        matchinObject['store'] = ObjectId(store);
                }
                AccountsCollection.find(matchinObject, function (err, result) {
                        if (!err) {
                                let accounts = result.slice();
                                let filtered = [];
                                console.log(accounts.length);
                                for (let i = 0; i < accounts.length; i++) {
                                        let found    = false;
                                        let mAccount = accounts[i];
                                        let account  = {
                                                _id: mAccount._id.toString(),
                                                name: mAccount.name,
                                                count: mAccount.count,
                                                group: mAccount.group,
                                                description: mAccount.description,
                                                unit: mAccount.unit,
                                                price: mAccount.price,
                                                oemNumber: mAccount.oemNumber,
                                                timestamp: mAccount.timestamp,
                                                model: mAccount.timestamp,
                                                store: mAccount.store.toString()
                                        };
                                        let keys     = Object.keys(account);
                                        for (let j = 0; j < keys.length; j++) {
                                                let value = account[keys[j]];
                                                if (String(value).indexOf(search) !== -1) {
                                                        found = true;
                                                        break;
                                                }
                                        }
                                        if (found) {
                                                filtered.push(account);
                                        }

                                }
                                resolve(filtered);
                        } else {
                                reject(err);
                        }
                });
        });
};

AccountModel.prototype.reports         = function (store = 'all', from, to, client = 'all') {
        return new Promise((resolve, reject) => {
                let matchingObject = {$match: {timestamp: {$gte: from, $lte: to}}};
                if (store !== 'all') {
                        matchingObject['$match'].storeId = ObjectId(store);
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
                let accountMerge  = {$unwind: '$account'};
                SalesCollection.aggregate([matchingObject, accountLookUp, accountMerge], function (err, result) {
                        if (!err) {
                                resolve(result);
                        } else {
                                console.log('error aggreagtion sales data');
                                console.log(err);
                                reject(err);
                        }
                });
        });
};
AccountModel.prototype.reportsXLSX     = function (store = 'all', from, to, client = 'all') {
        return new Promise((resolve, reject) => {
                this.reports(store, Number(from), Number(to), client).then(data => {
                        console.log(data.length);
                        let xlsxData = [];
                        let title    = [
                                'Name', 'OEM Number', 'Count', 'Unit', 'Price per Unit', 'Overall Sum', 'Customer', 'Time'
                        ];

                        const fileName = 'base';
                        xlsxData.push(title);

                        for (let i = 0; i < data.length; i++) {
                                let sale       = data[i];
                                let name       = sale.account.name;
                                let oemNumber  = sale.account.oemNumber;
                                let count      = sale.count;
                                let unit       = sale.account.unit;
                                let priceUnit  = sale.account.price;
                                let overallSum = sale.overallSum;
                                let customer   = '';
                                if (sale.customer) {
                                        customer = sale.customer.name;
                                }

                                let date = new Date(sale.timestamp).toLocaleString('ru');

                                let rowdata = [name, oemNumber, count, unit, priceUnit, overallSum, customer, date];
                                xlsxData.push(rowdata);
                        }
                        console.log(xlsxData.length);

                        this.createExcelFile(xlsxData, fileName, true).then(data => {
                                resolve(data);
                        });
                });
        });
};
AccountModel.prototype.balanceXLSX     = function (query) {
        return new Promise((resolve, reject) => {
                this.balance(query).then(data => {
                        console.log(data.length);
                        let xlsxData = [];
                        let title    = [
                                'Наименование', 'OEM Номер', 'Количество', 'Единица', 'Цена за единицу', 'Цена',  'Время добавления'
                        ];

                        const fileName = 'base';
                        xlsxData.push(title);

                        for (let i = 0; i < data.length; i++) {
                                let account       = data[i];
                                let name       = account.name;
                                let oemNumber  = account.oemNumber;
                                let count      = account.count;
                                let unit       = account.unit;
                                let priceUnit  = account.price;
                                let overallSum = account.overallSum;
                                let date = '';

                                if (account.timestamp) {
                                        date = new Date(account.timestamp).toLocaleString('ru');
                                }

                                let rowdata = [name, oemNumber, count, unit, priceUnit, overallSum, date];
                                xlsxData.push(rowdata);
                        }
                        console.log(xlsxData.length);

                        this.createExcelFile(xlsxData, fileName, true).then(data => {
                                resolve(data);
                        });
                });
        });


};
AccountModel.prototype.createExcelFile = function (data, apendName, createFile = true) {
        return new Promise((resolve, reject) => {
                let XLSX              = require('xlsx');
                let leftProductsSheet = 'ЛИСТ 1';


                let workbook        = {};
                workbook.Sheets     = {};
                workbook.Props      = {};
                workbook.SSF        = {};
                workbook.SheetNames = [];


                let worksheetLeft = {};
                let worksheetSold = {};
                let range         = {s: {c: 0, r: 0}, e: {c: 0, r: 0}};
                for (let R = 0; R != data.length; ++R) {
                        if (range.e.r < R) range.e.r = R;
                        for (let C = 0; C != data[R].length; ++C) {
                                if (range.e.c < C) range.e.c = C;

                                /* create cell object: .v is the actual data */
                                let cell = {v: data[R][C]};
                                if (cell.v == null) continue;

                                /* create the correct cell reference */
                                let cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                                /* determine the cell type */
                                if (typeof cell.v === 'number') {
                                        cell.t = 'n';
                                } else {
                                        cell.t = 's';
                                }
                                /* add to structure */
                                worksheetLeft[cell_ref] = cell;
                        }
                }

                worksheetLeft['!ref']        = XLSX.utils.encode_range(range);
                worksheetLeft['formatCells'] = true;
                workbook.SheetNames.push(leftProductsSheet);
                workbook.Sheets[leftProductsSheet] = worksheetLeft;

                let wopts = {
                        bookType: 'xlsx',
                        type: 'buffer'
                };

                let wbout = XLSX.write(workbook, wopts);

                function s2ab(s) {
                        let buf  = new ArrayBuffer(s.length);
                        let view = new Uint8Array(buf);
                        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                }

                let currentDate = new Date();
                let year        = currentDate.getFullYear();
                let month       = (currentDate.getMonth() < 10) ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
                let date        = (currentDate.getDate() < 10) ? '0' + currentDate.getDate() : currentDate.getDate();
                const fileName  = apendName + date + '-' + month + '-' + year + '.xlsx';

                resolve(wbout);

        });
};
module.exports                         = new AccountModel();