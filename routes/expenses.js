const express           = require('express');
const ExpenseCollection = require('../model/schemas/expense');
const Response          = require('../views/response');

let router = express.Router();
/**
 * @api {post} /expenses/create  Request Create Expense info
 * @apiName CreateExpense
 * @apiGroup Expenses
 *
 * @apiParam {Number} amount         Amount
 * @apiParam {String} description          Information
 *
 * @apiSuccess {Object} data Stored expense data in DB.
 * @apiSuccess {Object} meta Common response message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {Object},
 *       "meta": {
 *              "code": 0,
 *              "message": "OK"
 *       }
 *     }
 *
 */
router.post('/create', function (req, res) {
        let amount      = Number(req.body.amount);
        let description = String(req.body.description);
        let expense     = new ExpenseCollection({amount: amount, description, timestamp: (new Date()).getTime()});
        expense.save((err, onSave) => {
                if (!err) {
                        return Response.setData(res, onSave);
                }
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});
/**
 * @api {post} /expenses/list/:from/:to  Request Get expenses for specific period
 * @apiName GetExpenses
 * @apiGroup Expenses
 *
 * @apiParam {Number} from         Timestamp
 * @apiParam {Number} to          Timestamp
 *
 * @apiSuccess {Object} data List of expense data
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

 */
router.get('/list/:from/:to', function (req, res) {
        let from = req.params.from;
        let to   = req.params.to;
        ExpenseCollection.find({timestamp: {$gte: Number(from), $lte: Number(to)}}, function (err, result) {
                if (!err) {
                        return Response.setData(res, result);
                }
                Response.ErrorWithCodeAndMessage(res, -1, err);
        });
});

module.exports = router;
