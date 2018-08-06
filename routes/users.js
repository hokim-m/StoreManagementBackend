let express = require('express');
let router  = express.Router();
const UsersCollection = require('../model/schemas/user');
const Response = require('../views/response');


/* GET users listing. */
router.get('/', function (req, res, next) {
        res.send('respond with a resource');
});

router.post('/add', function (req, res) {
        let body = req.body;
        if (!body.hash) {
                return Response.ErrorWithCodeAndMessage(res, -1, "HASH INPUT IS REQUIRED");
        }
        if (!body.login) {
                return Response.ErrorWithCodeAndMessage(res, -1, "LOGIN INPUT IS REQUIRED");
        }
        let user = new UsersCollection(body);
        user.save((err, onSave)=> {
                if (!err) {
                        Response.setData(res, onSave);
                } else {
                        Response.UNHANDLED_ERROR(res);
                }
        })

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
        })
});

module.exports = router;
