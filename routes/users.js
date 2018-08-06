let express           = require('express');
let router            = express.Router();
const UsersCollection = require('../model/schemas/user');
const Response        = require('../views/response');
const ObjectId        = require('mongoose').Schema.Types.ObjectId;


/* GET users listing. */
router.get('/', function (req, res, next) {
        res.send('respond with a resource');
});

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

        UsersCollection.update({_id: ObjectId}, updatingParams, function (err, result) {
                if (!err) {
                        Response.setData(res, result);
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        })

});
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
router.get('/list', function (req, res) {
        UsersCollection.aggregate([
                {
                        $project: {
                                _id: 1,
                                login: 1,
                                name: 1,
                                group: 1
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
