let router = require('express').Router();
const CustomerModel = require('../model/customerModel');
const Response = require('../views/response');
/**
 * @api {post} /customers/add  Add Customer
 * @apiName AddCustomer
 * @apiGroup Customers

 * @apiParam {String} name                      User name info
 * @apiParam {String} [description]             If it is a company, can have description property
 * @apiParam {String} [phoneNumber]             Phone number
 * @apiParam {String} [address]                 Additional, address information, if necessary
 *
 * @apiSuccess {Object} data Stored customer data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Customer},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 *
 * @apiError CustomerNameError
 * @apiErrorExample CustomerNameError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `name`  is mandatory"
 *       }
 *     }
 */
router.post('/add', function (req, res) {
        let body = req.body;
        CustomerModel.add(body).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});
/**
 * @api {post} /customers/edit  Edit Customer
 * @apiName EditCustomer
 * @apiGroup Customers

 * @apiParam {String} customerId              Customer's id property
 * @apiParam {Customer} customer              Common customer data

 *
 * @apiSuccess {Object} data Stored customer data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Customer},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiUse UNHANDLED_ERROR
 * @apiError CustomerIdError
 * @apiErrorExample CustomerIdError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `customerId`  is mandatory"
 *       }
 *     }
 * @apiError CustomerCommonDataError
 * @apiErrorExample CustomerCommonDataError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `customer`  is mandatory"
 *       }
 *     }
 */
router.post('/edit', function (req, res) {
        let customerID = req.body.customerId;
        let customer = req.body.customer;

        CustomerModel.edit(customerID, customer).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});
/**
 * @api {get} /customers/remove/:id  Remove Customer
 * @apiName RemoveCustomer
 * @apiGroup Customers

 * @apiParam {String} customerId             Customer id
 *
 * @apiSuccess {Object} data Updating result.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Customer},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 * @apiError CustomerUpdatingIDError
 * @apiErrorExample CustomerUpdatingIDError:
 *     HTTP/1.1 200 OK
 *     {
 *       "meta": {
 *              "code": -1,
 *              "message": "Field `customer`  is mandatory"
 *       }
 *     }
 */
router.get('/remove/:customerID', function (req, res) {
        let customerID = req.params.customerID;
        CustomerModel.remove(customerID).then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});
/**
 * @api {get} /customers/list  Customers List
 * @apiName CustomersList
 * @apiGroup Customers

 * @apiSuccess {Array} data Array of customer list
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{
 *              "_id": String
 *              "name": String,
 *              "description": String,
 *              "phoneNumber": String,
 *              "address": String
 *       }],
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 */
router.get('/list', function (req, res) {
        CustomerModel.list().then(data=> {
                Response.setData(res, data);
        }).catch(err=> {
                Response.ErrorWithCodeAndMessage(res, -1, err);
        })
});


module.exports = router;