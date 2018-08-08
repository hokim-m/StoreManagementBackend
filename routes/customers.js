let router = require('express').Router();
const CustomerModel = require('../model/customerModel');
const Response = require('../views/response');

router.post('/add', function (req, res) {
        let body = req.body;
        CustomerModel.add(body).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});


router.post('/edit', function (req, res) {
        let customerID = req.body.customerId;
        let customer = req.body.customer;

        CustomerModel.edit(customerID, customer).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});

router.post('/remove', function (req, res) {
        let customerID = req.body.customerID;
        CustomerModel.remove(customerID).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});

router.get('/list', function (req, res) {
        CustomerModel.list().then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});


module.exports = router;