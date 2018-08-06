const express = require('express');
const AccountModel = require('../model/accountModel');
const Response = require('../views/response');
let ObjectId = require('mongoose').Types.ObjectId;
let router = express.Router();

router.get('/balance/:id', function (req, res) {
             let id = req.params.id;
             let query = id === "all" ? {} : {store: ObjectId(id)};

             AccountModel.balance(query).then(data=> {
                     Response.setData(res, data);
             }).catch(err=> {
                     Response.ErrorWithCodeAndMessage(res, -1, err);
             })
});

router.post('/add', function (req, res) {
        let body = req.body;
        AccountModel.addAccount(body).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

router.post('/sell/:id', function (req, res) {
        let accountId = req.params.id;
        let account = req.body;
        AccountModel.sellAccount(accountId, account).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});

router.get('/reports/:id/:from/:to', function (req, res) {
        let from = req.params.from;
        let to = req.params.to;
        let id = req.params.id;
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