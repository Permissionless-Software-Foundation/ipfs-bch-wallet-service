/*
  REST API library for /fulcrum route.
*/

// Public npm libraries.
const Router = require('koa-router')

// Local libraries.
const BCHRESTController = require('./controller')

class BCHRouter {
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

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.bchRESTController = new BCHRESTController(dependencies)

    // Instantiate the router and set the base route.
    const baseUrl = '/bch'
    this.router = new Router({ prefix: baseUrl })
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.post('/transactions', this.bchRESTController.transactions)
    this.router.post('/balance', this.bchRESTController.balance)
    this.router.post('/utxos', this.bchRESTController.utxos)
    this.router.post('/broadcast', this.bchRESTController.broadcast)

    // Attach the Controller routes to the Koa app.
    app.use(this.router.routes())
    app.use(this.router.allowedMethods())
  }
}

module.exports = BCHRouter
