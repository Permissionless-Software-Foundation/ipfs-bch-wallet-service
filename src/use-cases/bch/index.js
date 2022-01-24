/*
  Use Cases for interacting with the BCH blockchain.
*/

class BCHUseCases {
  constructor (localConfig = {}) {
    // console.log('User localConfig: ', localConfig)
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating BCH Use Cases library.'
      )
    }

    // Encapsulate dependencies
    this.bchjs = this.adapters.bchjs
  }

  // Get transaction history for an address, sorted by block height.
  async getTransactions (rpcData) {
    const addrs = rpcData.payload.params.addresses

    return addrs
  }
}

module.exports = BCHUseCases
