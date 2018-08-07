const router     = require('express').Router();
const Promise    = require('bluebird');
const Response   = require('../views/response');
const StoreModel = require('../model/storeModel');


router.post('/add', function (req, res) {
        const body = req.body;
        StoreModel.add(body).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.post('/edit', function (req, res) {
        const story   = req.body.story;
        const storyID = req.body.storyID;
        StoreModel.edit(storyID, story).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.post('/remove', function (req, res) {
        const storyID = req.body.storyID;
        StoreModel.remove(storyID).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.get('/list', function (req, res) {
        StoreModel.list().then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});



module.exports = router;