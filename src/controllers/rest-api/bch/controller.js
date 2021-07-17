/*
  Controller for the /fulcrum REST API endpoints.
*/

// const BCHJS = require('@psf/bch-js')

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

    // this.bchjs = new BCHJS()
    this.bchjs = this.adapters.bchjs

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
   * @api {post} /bch/utxos UTXOs
   * @apiName UTXOs
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

  /**
   * @api {post} /bch/broadcast Broadcast
   * @apiName Broadcast
   * @apiGroup REST BCH
   * @apiDescription Broadcast a transaction to the BCH network.
   * The transaction should be encoded as a hexidecimal string.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000" }' localhost:5001/bch/broadcast
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
  async broadcast (ctx) {
    try {
      const hex = ctx.request.body.hex

      const txid = await _this.bchjs.RawTransactions.sendRawTransaction(hex)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      ctx.body = txid
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/transaction Transaction
   * @apiName Transaction
   * @apiGroup REST BCH
   * @apiDescription Get data about a specific transaction.
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b" }' localhost:5001/bch/transaction
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
  async transaction (ctx) {
    try {
      const txid = ctx.request.body.txid

      const data = await _this.bchjs.Transaction.get(txid)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

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
module.exports = BCHRESTController
