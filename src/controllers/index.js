/*
  This is a top-level library that encapsulates all the additional Controllers.
  The concept of Controllers comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Public npm libraries.

// Load the Clean Architecture Adapters library
const adapters = require('../adapters')

// Load the JSON RPC Controller.
const JSONRPC = require('./json-rpc')

// Load the Clean Architecture Use Case libraries.
const UseCases = require('../use-cases')
// const useCases = new UseCases({ adapters })

// Load the REST API Controllers.
const RESTControllers = require('./rest-api')

class Controllers {
  constructor (localConfig = {}) {
    this.adapters = adapters
    this.useCases = new UseCases({ adapters })
  }

  async attachControllers (app) {
    // Get a JWT token and instantiate bch-js with it. Then pass that instance
    // to all the rest of the apps controllers and adapters.
    await adapters.fullStackJwt.getJWT()
    // Instantiate bch-js with the JWT token, and overwrite the placeholder for bch-js.
    adapters.bchjs = await adapters.fullStackJwt.instanceBchjs()

    // Attach the REST controllers to the Koa app.
    this.attachRESTControllers(app)

    // Start IPFS.
    await this.adapters.ipfs.start({ bchjs: adapters.bchjs })

    this.attachRPCControllers()
  }

  // Top-level function for this library.
  // Start the various Controllers and attach them to the app.
  attachRESTControllers (app) {
    const rESTControllers = new RESTControllers({
      adapters: this.adapters,
      useCases: this.useCases
    })

    // Attach the REST API Controllers associated with the boilerplate code to the Koa app.
    rESTControllers.attachRESTControllers(app)
  }

  // Add the JSON RPC router to the ipfs-coord adapter.
  attachRPCControllers () {
    const jsonRpcController = new JSONRPC({
      adapters: this.adapters,
      useCases: this.useCases
    })

    // Attach the input of the JSON RPC router to the output of ipfs-coord.
    this.adapters.ipfs.ipfsCoordAdapter.attachRPCRouter(
      jsonRpcController.router
    )
  }
}

module.exports = Controllers
