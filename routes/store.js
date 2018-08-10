let express           = require('express');
let router            = express.Router();
const Promise    = require('bluebird');
const Response   = require('../views/response');
const StoreModel = require('../model/storeModel');

/**
 * @api {post} /store/add  Add Store
 * @apiName AddStore
 * @apiGroup Store

 * @apiParam {String} title              Title to represent store instance
 * @apiParam {String} [description]      Additional information about store
 * @apiParam {String} [parent]           Parent store _id. (ObjectID hex string representation). Pushes to parent store `sub` property
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Store},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError StoreTitleError
 * @apiErrorExample StoreTitleError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `title`  is mandatory"
 *       }
 *     }
 */

router.post('/add', function (req, res) {
        console.log("hello");
        const body = req.body;
        StoreModel.add(body).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /store/edit  Edit Store
 * @apiName EditStore
 * @apiGroup Store

 * @apiParam {String} storeID              Store _id hex string
 * @apiParam {Object} store           Updating store info
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Store},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError StorePropertyError
 * @apiErrorExample StorePropertyError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `store`  is mandatory"
 *       }
 *     }
 * @apiError StoreIDError
 * @apiErrorExample StoreIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `storeID`  is mandatory"
 *       }
 *     }
 */
router.post('/edit', function (req, res) {
        const story   = req.body.store;
        const storyID = req.body.storeID;
        StoreModel.edit(storyID, story).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /store/remove  Remove Store
 * @apiName RemoveStore
 * @apiGroup Store

 * @apiParam {String} storeID              Store _id hex string
 *
 * @apiSuccess {Object} data Stored account data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Store},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError StoreIDError
 * @apiErrorExample StoreIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `storeID`  is mandatory"
 *       }
 *     }
 */
router.post('/remove', function (req, res) {
        const storeID = req.body.storeID;
        StoreModel.remove(storeID).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {get} /store/list/  Store List
 * @apiName GetStoreList
 * @apiGroup Store
 *
 *
 * @apiSuccess {Array} data Array of store data.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{
 *              sub: [],
 *              title: String,
 *              description: String,
 *              timestamp: Number,
 *              }],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 */
router.get('/list', function (req, res) {
        StoreModel.list().then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});



module.exports = router;