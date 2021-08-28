/*
  Clean Architecture Adapter for ipfs-coord.
  This library deals with ipfs-coord library so that the apps business logic
  doesn't need to have any specific knowledge of the library.
*/

// Global npm libraries
const IpfsCoord = require('ipfs-coord')
// const BCHJS = require('@psf/bch-js')

// Local libraries
const config = require('../../../config')
// const JSONRPC = require('../../controllers/json-rpc/')

let _this

class IpfsCoordAdapter {
  constructor (localConfig = {}) {
    // Dependency injection.
    this.ipfs = localConfig.ipfs
    if (!this.ipfs) {
      throw new Error(
        'Instance of IPFS must be passed when instantiating ipfs-coord.'
      )
    }
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error(
        'Instance of bch-js must be passed when instantiating ipfs-coord.'
      )
    }

    // Encapsulate dependencies
    this.IpfsCoord = IpfsCoord
    this.ipfsCoord = {}
    // this.rpc = new JSONRPC()
    this.config = config

    // Properties of this class instance.
    this.isReady = false

    _this = this
  }

  async start (localConfig = {}) {
    // console.log('this.config.announceJsonLd: ', this.config.announceJsonLd)

    this.ipfsCoord = new this.IpfsCoord({
      ipfs: this.ipfs,
      type: 'node.js',
      // type: 'browser',
      bchjs: this.bchjs,
      privateLog: console.log, // Default to console.log
      isCircuitRelay: this.config.isCircuitRelay,
      apiInfo: this.config.apiInfo,
      announceJsonLd: this.config.announceJsonLd,
      mnemonic: this.config.mnemonic,
      debugLevel: this.config.debugLevel
    })

    // Wait for the ipfs-coord library to signal that it is ready.
    await this.ipfsCoord.start({ type: 'node.js' })

    // Signal that this adapter is ready.
    this.isReady = true

    return this.isReady
  }

  // Expects router to be a function, which handles the input data from the
  // pubsub channel. It's expected to be capable of routing JSON RPC commands.
  attachRPCRouter (router) {
    try {
      _this.ipfsCoord.privateLog = router
      _this.ipfsCoord.adapters.orbit.privateLog = router
    } catch (err) {
      console.error('Error in attachRPCRouter()')
      throw err
    }
  }
}

module.exports = IpfsCoordAdapter
