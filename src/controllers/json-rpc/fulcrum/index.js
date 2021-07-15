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

class FulcrumRPC {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Fulcrum JSON RPC Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Fulcrum JSON RPC Controller.'
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
  async fulcrumRouter (rpcData) {
    let endpoint = 'unknown'
    try {
      // console.log('fulcrumRouter rpcData: ', rpcData)

      endpoint = rpcData.payload.params.endpoint
      let user

      // Route the call based on the value of the method property.
      switch (endpoint) {
        case 'transactions':
          await this.rateLimit.limiter(rpcData.from)
          return await this.transactions(rpcData)

        // case 'getAllUsers':
        //   await this.validators.ensureUser(rpcData)
        //   await this.rateLimit.limiter(rpcData.from)
        //   return await this.getAll(rpcData)
        //
        // case 'getUser':
        //   user = await this.validators.ensureUser(rpcData)
        //   await this.rateLimit.limiter(rpcData.from)
        //   return await this.getUser(rpcData, user)
        //
        // case 'updateUser':
        //   user = await this.validators.ensureTargetUserOrAdmin(rpcData)
        //   await this.rateLimit.limiter(rpcData.from)
        //   return await this.updateUser(rpcData, user)
        //
        // case 'deleteUser':
        //   user = await this.validators.ensureTargetUserOrAdmin(rpcData)
        //   await this.rateLimit.limiter(rpcData.from)
        //   return await this.deleteUser(rpcData, user)
      }
    } catch (err) {
      console.error('Error in FulcrumRPC/rpcRouter()')
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
   * @api {JSON} /fulcrum Transactions
   * @apiPermission public
   * @apiName Transactions
   * @apiGroup JSON Fulcrum
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"fulcrum","params":{ "endpoint": "transactions", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
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
   * @api {JSON} /fulcrum Balance
   * @apiPermission public
   * @apiName Balance
   * @apiGroup JSON Fulcrum
   * @apiDescription This endpoint wraps the bchjs.Electrumx.balance([]) function.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"fulcrum","params":{ "endpoint": "balance", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
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

  // TODO create deleteUser()
}

module.exports = FulcrumRPC
