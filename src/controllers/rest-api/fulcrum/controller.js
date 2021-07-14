/*
  Controller for the /fulcrum REST API endpoints.
*/

const BCHJS = require('@psf/bch-js')

let _this

class FulcrumController {
  constructor () {
    _this = this
    _this.bchjs = new BCHJS()
  }

  /**
   * @api {post} /fulcrum/transactions Transactions
   * @apiName Transactions
   * @apiGroup REST Fulcrum
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"] }' localhost:5001/fulcrum/transactions
   *
   * @apiParam {Object} obj           object (required)
   * @apiParam {String} obj.email Sender Email.
   * @apiParam {String} obj.formMessage Message.
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *
   *        success:true,
   *        data: <data>
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async transactions (ctx) {
    try {
      const addrs = ctx.request.body.addresses

      const data = await _this.bchjs.Electrumx.transactions(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      ctx.body = data
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  // DRY error handler
  handleError (ctx, err) {
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }
}
module.exports = FulcrumController
