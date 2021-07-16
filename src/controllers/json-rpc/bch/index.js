/*
  This is the JSON RPC router for the Fulcrum API
*/

// Public npm libraries
const jsonrpc = require('jsonrpc-lite')
const BCHJS = require('@psf/bch-js')

// Local libraries
// const UserLib = require('../../../use-cases/user')
const Validators = require('../validators')
const RateLimit = require('../rate-limit')

class BCHRPC {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating BCH JSON RPC Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating BCH JSON RPC Controller.'
      )
    }

    // Encapsulate dependencies
    this.userLib = this.useCases.user
    this.jsonrpc = jsonrpc
    this.validators = new Validators(localConfig)
    this.rateLimit = new RateLimit()
    this.bchjs = new BCHJS()
  }

  // Top-level router for this library. All other methods in this class are for
  // a specific endpoint. This method routes incoming calls to one of those
  // methods.
  async bchRouter (rpcData) {
    let endpoint = 'unknown'
    try {
      // console.log('fulcrumRouter rpcData: ', rpcData)

      endpoint = rpcData.payload.params.endpoint
      // let user

      // Route the call based on the value of the method property.
      switch (endpoint) {
        case 'transactions':
          await this.rateLimit.limiter(rpcData.from)
          return await this.transactions(rpcData)

        case 'balance':
          await this.rateLimit.limiter(rpcData.from)
          return await this.balance(rpcData)

        case 'utxos':
          await this.rateLimit.limiter(rpcData.from)
          return await this.utxos(rpcData)

        case 'broadcast':
          await this.rateLimit.limiter(rpcData.from)
          return await this.broadcast(rpcData)

        case 'transaction':
          await this.rateLimit.limiter(rpcData.from)
          return await this.transaction(rpcData)
      }
    } catch (err) {
      console.error('Error in BCHRPC/rpcRouter()')
      // throw err

      return {
        success: false,
        status: err.status || 500,
        message: err.message,
        endpoint
      }
    }
  }

  /**
   * @api {JSON} /bch Transactions
   * @apiPermission public
   * @apiName Transactions
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "transactions", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
   *
   */
  async transactions (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addrs = rpcData.payload.params.addresses

      const data = await this.bchjs.Electrumx.transactions(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'transactions'
      }
    }
  }

  /**
   * @api {JSON} /bch Balance
   * @apiPermission public
   * @apiName Balance
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.balance([]) function.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "balance", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
   *
   */
  async balance (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addrs = rpcData.payload.params.addresses

      const data = await this.bchjs.Electrumx.balance(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'balance'
      }
    }
  }

  /**
   * @api {JSON} /bch UTXOs
   * @apiPermission public
   * @apiName UTXOs
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Utxos.get() function. This
   * endpoint returns UTXOs held at an address, hydrated
   * with token information.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "utxos", "address": "bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"}}
   *
   */
  async utxos (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addr = rpcData.payload.params.address

      const data = await this.bchjs.Utxo.get(addr)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'utxos'
      }
    }
  }

  /**
   * @api {JSON} /bch Broadcast
   * @apiPermission public
   * @apiName Broadcast
   * @apiGroup JSON BCH
   * @apiDescription Broadcast a transaction to the BCH network.
   * The transaction should be encoded as a hexidecimal string.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "broadcast", "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000"}}
   *
   */
  async broadcast (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const hex = rpcData.payload.params.hex

      const data = await this.bchjs.RawTransactions.sendRawTransaction(hex)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'broadcast'
      }
    }
  }

  /**
   * @api {JSON} /bch Transaction
   * @apiPermission public
   * @apiName Transaction
   * @apiGroup JSON BCH
   * @apiDescription Get data about a specific transaction.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "transaction", "hex": "0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098"}}
   *
   */
  async transaction (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const txid = rpcData.payload.params.txid

      const data = await this.bchjs.Transaction.get(txid)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'transaction'
      }
    }
  }
}

module.exports = BCHRPC
