/*
  Controller for the /fulcrum REST API endpoints.
*/

const BCHJS = require('@psf/bch-js')

let _this

class BCHRESTController {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating BCH REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating BCH REST Controller.'
      )
    }

    this.bchjs = new BCHJS()

    _this = this
  }

  /**
   * @api {post} /bch/transactions Transactions
   * @apiName Transactions
   * @apiGroup REST BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"] }' localhost:5001/bch/transactions
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

  /**
   * @api {post} /bch/balance Balance
   * @apiName Balance
   * @apiGroup REST BCH
   * @apiDescription This endpoint returns the balance in BCH for an address.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"] }' localhost:5001/bch/balance
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
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
  async balance (ctx) {
    try {
      const addrs = ctx.request.body.addresses

      const data = await _this.bchjs.Electrumx.balance(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      ctx.body = data
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/utxos Balance
   * @apiName Utxos
   * @apiGroup REST BCH
   * @apiDescription This endpoint returns UTXOs held at an address, hydrated
   * with token information.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "address": "bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj" }' localhost:5001/bch/utxos
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
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
  async utxos (ctx) {
    try {
      const address = ctx.request.body.address

      const utxos = await _this.bchjs.Utxo.get(address)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      ctx.body = utxos
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
module.exports = BCHRESTController
