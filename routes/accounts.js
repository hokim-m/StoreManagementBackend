const express = require('express');
const AccountModel = require('../model/accountModel');
const Response = require('../views/response');
let ObjectId = require('mongoose').Types.ObjectId;
let router = express.Router();
/**
 * @apiDefine UNHANDLED_ERROR
 *
 * @apiError UNHANDLED_ERROR Occurred error parsing, or manipulating error with given data.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "UNHANDLED_ERROR"
 *       }
 *     }
 */

/**
 * @api {get} /accounts/balance/ :id Request Account Balance
 * @apiName GetBalance
 * @apiGroup Accounts
 *
 * @apiParam {Number} id Store Unique ID. Use `all` to select all store available
 *
 * @apiSuccess {Array} data Array of account data.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{Account}, {Account}],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError IDNotFound The <code>id</code> of the Store is mandatory.
 */
router.get('/balance/:id', function (req, res) {
             let id = req.params.id;
             let query = id === "all" ? {} : {store: ObjectId(id)};

             AccountModel.balance(query).then(data=> {
                     Response.setData(res, data);
             }).catch(err=> {
                     Response.ErrorWithCodeAndMessage(res, -1, err);
             })
});
/**
 * @api {post} /accounts/add/  Request Add Account
 * @apiName AddAccount
 * @apiGroup Accounts

 * @apiParam {String} name              Title to represent account
 * @apiParam {String} group             Group identifier for account
 * @apiParam {String} [description]     Account description
 * @apiParam {String} unit              Unit for account. kg|
 * @apiParam {String} [source=Admin]    Who is adding new account
 * @apiParam {String} oemNumber         Account's O.E.M number
 * @apiParam {String} modelName         Account model name
 * @apiParam {Number} price             Price
 * @apiParam {Number} [count=1]         Count for account. Default 0
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Account},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 */
router.post('/add', function (req, res) {
        let body = req.body;
        AccountModel.addAccount(body).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /accounts/update/  Request Update Account
 * @apiName UpdateAccount
 * @apiGroup Accounts
 *
 * @apiParam {String} accountId         Title to represent account
 * @apiParam {Account} account          Account data to update
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Account},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError UpdateAccountIDError Field <code>accountID</code> is mandatory
 */
router.post('/update', function (req, res) {
        let body = req.body;
        if (!body.accountId) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Account ID is mandatory");
        }
        AccountModel.updateAccount(body.accountId, body.account).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.UNHANDLED_ERROR(res);
        })
});
/**
 * @api {post} /accounts/parse-xlsx/  Request Accounts Parse XSLX
 * @apiName AccountsParseXLSX
 * @apiGroup Accounts
 *
 * @apiParam {String} file         BASE64 encoded file data
 * @apiParam {String} name         File name
 *
 * @apiSuccess {Object} data Created account list(?).
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{Account}],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError ParseXLSXFileError Field <code>file</code> is mandatory. Either base64 string content corrupted
 * @apiError ParseXLSXFileNameError Field<code>name</code> is mandatory.
 */
router.post('/parse-xlsx', function (req, res) {
        const file = req.body.file;
        const fileName = req.body.name;
        if (!file) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Field file is mandatory");
        }
        if (!fileName) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Filed name is mandatory!");
        }
        AccountModel.parseXLSX(file).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /accounts/sell/:id  Request Sell Account
 * @apiName SellAccount
 * @apiGroup Accounts
 *
 * @apiParam {String} id         Account ID (ObjectId hex string representation)
 * @apiParam {Object} account   Account data
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Account},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError SellAccountIDError Request param <code>:id</code> is mandatory
 */
router.post('/sell/:id', function (req, res) {
        let accountId = req.params.id;
        let account = req.body;
        AccountModel.sellAccount(accountId, account).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});
/**
 * @api {get} /accounts/reports/:id/:from/:to  Request Sale Reports
 * @apiName GetSaleReports
 * @apiGroup Accounts
 *
 * @apiParam {String} id         Store ID (Object ID hex string representation). Can use `all` to search through all store available
 * @apiParam {Number} from       Unix timestamp in milliseconds. Starting time offset to fetch sold account
 * @apiParam {Number} to        Unix timestamp in milliseconds. Limiting time offset to fetch sold accounts
 *
 * @apiSuccess {Object} data Created account list(?).
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{Account}],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError GetSaleReportsStoreID Request param <code>:id</code> is mandatory
 * @apiError GetSaleReportsFromTimestamp Request param <code>:from</code> is mandatory
 * @apiError GetSaleReportsToTimestamp Request param <code>:to</code> is mandatory
 */
router.get('/reports/:id/:from/:to', function (req, res) {
        let from = req.params.from;
        let to = req.params.to;
        let id = req.params.id;
        if (!id) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Request param `id` is mandatory");
        }
        if (!from) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Request param `from` is mandatory");
        }
        if (!to) {
                return Response.ErrorWithCodeAndMessage(res, -1, "Request param `to` is mandatory");
        }
        let query = {
                timestamp: {$gte: Number(from), $lte: Number(to)}
        };
        if (id !== 'all') {
                query['store'] = ObjectId(id);
        }
        AccountModel.soldBalance(query).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});

module.exports = router;