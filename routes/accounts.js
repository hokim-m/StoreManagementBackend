const express      = require('express');
const AccountModel = require('../model/accountModel');
const Response     = require('../views/response');
let ObjectId       = require('mongoose').Types.ObjectId;
let router         = express.Router();
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
 * @api {get} /goods/balance/:id  Goods Balance
 * @apiName GetBalance
 * @apiGroup Goods
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
 * @apiErrorExample IDNotFound:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "The `id` of the Store is mandatory"
 *       }
 *     }
 */
router.get('/balance/:id', function (req, res) {
        let id    = req.params.id;
        let query = id === 'all' ? {} : {store: ObjectId(id)};

        AccountModel.balance(query).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /goods/add/  Add Good
 * @apiName AddGood
 * @apiGroup Goods

 * @apiParam {String} name              Title to represent account
 * @apiParam {String} group             Group identifier for account
 * @apiParam {String} store             Store ObjectId hex string representation
 * @apiParam {String} [description]     Account description
 * @apiParam {String} unit              Unit for account. kg|
 * @apiParam {String} [source=Admin]    Who is adding new account
 * @apiParam {String} oemNumber         Account's O.E.M number
 * @apiParam {String} modelName         Account model name
 * @apiParam {Number} price             Price
 * @apiParam {Number} [count=1]         Count for account.
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
        AccountModel.addAccount(body).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /goods/update/  Request Update Good
 * @apiName UpdateGood
 * @apiGroup Goods
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
 * @apiErrorExample UpdateAccountIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `accountID`  is mandatory"
 *       }
 *     }
 */
router.post('/update', function (req, res) {
        let body = req.body;
        if (!body.accountId) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Account ID is mandatory');
        }
        AccountModel.updateAccount(body.accountId, body.account).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.UNHANDLED_ERROR(res);
        });
});
/**
 * @api {post} /goods/parse-xlsx/  Goods Parse XSLX (uploading file)
 * @apiName GoodsParseXLSX
 * @apiGroup Goods
 *
 * @apiParam {File} file         File
 * @apiParam {String} name         File name
 * @apiParam {String} store Store ID
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
 * @apiErrorExample ParseXLSXFileError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `file`  is mandatory. Either base64 string content corrupted"
 *       }
 *     }
 * @apiError ParseXLSXFileNameError Field<code>name</code> is mandatory.
 * @apiErrorExample ParseXLSXFileNameError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `name`  is mandatory."
 *       }
 *     }
 */
router.post('/parse-xlsx', function (req, res) {
        console.log(req.files);
        let filesObject = req.files;
        let body        = req.body;
        const file      = filesObject.file;
        const fileName  = body.name;
        const store     = body.store;
        if (!file) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Field file is mandatory');
        }
        if (!fileName) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Filed name is mandatory!');
        }
        AccountModel.parseXLSX(file, store).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                console.log(err);
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /goods/sell/:id  Request Sell Goods
 * @apiName SellGood
 * @apiGroup Goods
 *
 * @apiParam {String} id         Account ID (ObjectId hex string representation)
 * @apiParam {String} clientId   Client ID (ObjectId hex string representation)
 * @apiParam {Number} count     Number of products to sell
 * @apiParam {String} userId    User ID (ObjectId hex string representation)
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
 * @apiErrorExample SellAccountIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Request param `id`  is mandatory."
 *       }
 *     }
 */
router.post('/sell/:id', function (req, res) {
        let accountId = req.params.id;
        let body      = req.body;
        AccountModel.sellAccount(accountId, body).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {get} /goods/reports/:id/:from/:to  Request Sale Reports
 * @apiName GetSaleReports
 * @apiGroup Goods
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
 * @apiErrorExample GetSaleReportsStoreID:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Request param `id`  is mandatory."
 *       }
 *     }
 * @apiError GetSaleReportsFromTimestamp Request param <code>:from</code> is mandatory
 * @apiErrorExample GetSaleReportsFromTimestamp:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Request param `from`  is mandatory."
 *       }
 *     }
 * @apiError GetSaleReportsToTimestamp Request param <code>:to</code> is mandatory
 * @apiErrorExample GetSaleReportsToTimestamp:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Request param `to`  is mandatory."
 *       }
 *     }
 */
router.get('/reports/:store_id/:client_id/:from/:to', function (req, res) {
        let from      = Number(req.params.from);
        let to        = Number(req.params.to);
        let id        = req.params.store_id;
        let client_id = req.params.client_id;

        if (!id) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `id` is mandatory');
        }
        if (isNaN(from)) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `from` is mandatory');
        }
        if (isNaN(to)) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `to` is mandatory');
        }
        let query = {
                timestamp: {$gte: Number(from), $lte: Number(to)}
        };
        if (id !== 'all') {
                query['store'] = ObjectId(id);
        }
        AccountModel.reports(id, from, to, client_id).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
router.get('/reports-xlsx/:store_id/:client_id/:from/:to', function (req, res) {
        let from      = Number(req.params.from);
        let to        = Number(req.params.to);
        let id        = req.params.store_id;
        let client_id = req.params.client_id;

        if (!id) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `id` is mandatory');
        }
        if (isNaN(from)) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `from` is mandatory');
        }
        if (isNaN(to)) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Request param `to` is mandatory');
        }
        let query = {
                timestamp: {$gte: Number(from), $lte: Number(to)}
        };
        if (id !== 'all') {
                query['store'] = ObjectId(id);
        }
        AccountModel.reportsXLSX(id, from, to, client_id).then(data => {
                let currentDate = new Date();
                let year        = currentDate.getFullYear();
                let month       = (currentDate.getMonth() < 10) ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
                let date        = (currentDate.getDate() < 10) ? '0' + currentDate.getDate() : currentDate.getDate();
                const fileName  = 'reports' + date + '-' + month + '-' + year + '.xlsx"';

                res.header('Content-Type', 'application/octet-stream');
                res.header('Content-Disposition', 'attachment; filename="' + fileName);


                res.send(data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.post('/search', function (req, res) {
        const query = req.body.search;
        AccountModel.search(query).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.setData(res, err);
        });
});
module.exports = router;