let express           = require('express');
let router            = express.Router();
const UsersCollection = require('../model/schemas/user');
const Response        = require('../views/response');
const ObjectId        = require('mongoose').Types.ObjectId;
/**
 * @api {post} /users/add  Add User
 * @apiName AddUser
 * @apiGroup Users

 * @apiParam {String} login             User login
 * @apiParam {String} name              User name info
 * @apiParam {Number} group             Group info
 * @apiParam {String} hash              SHA256 string. Creation: sha256(login + password)
 * @apiParam {String} store             Store ID
 *
 * @apiSuccess {Object} data Stored user data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {User},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError UserHashError
 * @apiErrorExample UserHashError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `hash`  is mandatory"
 *       }
 *     }
 * @apiError UserLoginError
 * @apiErrorExample UserLoginError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `login`  is mandatory"
 *       }
 *     }
 */
router.post('/add', function (req, res) {
        let body = req.body;
        if (!body.hash) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'HASH INPUT IS REQUIRED');
        }
        if (!body.login) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'LOGIN INPUT IS REQUIRED');
        }
        let user = new UsersCollection(body);
        user.save((err, onSave) => {
                if (!err) {
                        Response.setData(res, onSave);
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        });

});
/**
 * @api {post} /users/login  Authorize User
 * @apiName AuthUser
 * @apiGroup Users

 * @apiParam {String} login             User login
 * @apiParam {String} hash              SHA256 string. Creation: sha256(login + password)
 *
 * @apiSuccess {Boolean} data Boolean indicating whether auth or not. (true -- success, false -- not success :) )
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Boolean},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 */
router.post('/login', function (req, res) {
        const login = req.body.login;
        const hash  = req.body.hash;
        UsersCollection.aggregate([{$match: {login, hash}}, {
                $project: {
                        _id: 1,
                        login: 1,
                        name: 1,
                        group: 1,
                        store: 1
                }
        }], function (err, result) {
                if (!err) {
                        let found = result.length > 0;
                        if (found) {
                                Response.setData(res, result[0]);
                        } else {
                                Response.setData(res, false);
                        }

                } else {
                        Response.ErrorWithCodeAndMessage(res, -1, err);
                }
        });
});
/**
 * @api {post} /users/update  Edit User
 * @apiName EditUser
 * @apiGroup Users

 * @apiParam {String} userId             User id
 * @apiParam {Object} user              Updating user info
 *
 * @apiSuccess {Object} data Updating result.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {User},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError UserUpdatingPropertyError
 * @apiErrorExample UserUpdatingPropertyError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `user`  is mandatory"
 *       }
 *     }
 * @apiError UserUpdatingIDError
 * @apiErrorExample UserUpdatingIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `userId`  is mandatory"
 *       }
 *     }
 */
router.post('/update', function (req, res) {
        const userId       = req.body.userId;
        const user         = req.body.user;
        let updatingParams = {$set: {}};
        if (!user) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Property `user` is required!');
        }
        if (!userId) {
                return Response.ErrorWithCodeAndMessage(res, -1, 'Property `userId` is required!');
        }

        Object.keys(user).map(key => {
                updatingParams['$set'][key] = user[key];
        });

        UsersCollection.update({_id: ObjectId(userId)}, updatingParams, function (err, result) {
                if (!err) {
                        UsersCollection.findOne({_id: ObjectId(userId)}, function (err, user) {
                                Response.setData(res, user);
                        });
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        });

});
/**
 * @api {get} /users/remove/:id  Remove User
 * @apiName RemoveUser
 * @apiGroup Users

 * @apiParam {String} userId             User id
 *
 * @apiSuccess {Object} data Updating result.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {User},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiError UserUpdatingIDError
 * @apiErrorExample UserUpdatingIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `userId`  is mandatory"
 *       }
 *     }
 */
router.get('/remove/:id', function (req, res) {
        let userId = req.params.id;
        try {
                let obj = ObjectId(userId);
        } catch (e) {
                Response.ErrorWithCodeAndMessage(res, -1, 'Incorrect ObjectId passed as user id');
        }
        UsersCollection.remove({_id: ObjectId(userId)}, function (err, result) {
                if (!err) {
                        Response.setData(res, result);
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        });
});
/**
 * @api {get} /users/list  Users List
 * @apiName UsersList
 * @apiGroup Users

 * @apiSuccess {Array} data Array of user list
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{
 *              "_id": String
 *              "name": String,
 *              "group": Number,
 *              "login": String
 *       }],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 */
router.get('/list', function (req, res) {
        UsersCollection.aggregate([
                {
                        $project: {
                                _id: 1,
                                login: 1,
                                name: 1,
                                group: 1,
                                store: 1
                        }
                }
        ], function (err, result) {
                if (!err) {
                        Response.setData(res, result);
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        });
});

module.exports = router;
