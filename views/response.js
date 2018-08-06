const CODES   = {
        'OK'               : 0,
        'UNHANDLED_ERROR'  : -1,
        'TERMINATE_SESSION': -2
};

/**
 * Response Model. Overwriting the data in to
 * constructed way
 * {
 *      data: /some data, {Object}
 *      meta: {
 *              code: /code {Number}
 *              message: /status {String}
 *              }
 *  }
 * @constructor
 */
function Response () {
        this.code = CODES;
}
/**
 *
 * @param res {Response} Express JS res method
 * @param data {Object}
 */
Response.prototype.setData = function (res, data) {
        this.pFillResponse(res, data, CODES.OK);
};
/**
 * @requires res
 * @param res
 * @constructor
 */
Response.prototype.TERMINATE_SESSION = function (res) {
        this.pFillResponse(res, null, CODES.TERMINATE_SESSION);
};
Response.prototype.UNHANDLED_ERROR   = function (res) {
        this.pFillResponse(res, null, CODES.UNHANDLED_ERROR);
};
Response.prototype.pFillResponse     = function (res = null, data = null, code = null) {
        let response = {};
        if (data != null) {
                response.data = data;
        }
        response.meta         = {};
        response.meta.code    = code;
        response.meta.message = Object.keys(CODES).filter(function (key) {
                return CODES[ key ] === code
        })[ 0 ];

        res.send(response);
};
/**
 *
 * @param res {Response} Express JS res method
 * @param code {Number}
 * @param message {Object}
 */
Response.prototype.ErrorWithCodeAndMessage = function (res, code, message) {
        let response = {};
        response.meta = {
                code,
                message
        };
        res.send(response);
};
module.exports                       = new Response();