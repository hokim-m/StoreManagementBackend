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
        const story   = req.body.store;
        const storyID = req.body.storeID;
        StoreModel.edit(storyID, story).then(data => {
                Response.setData(res, data);
        }).catch(err => {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.post('/remove', function (req, res) {
        const storeID = req.body.storeID;
        StoreModel.remove(storeID).then(data => {
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