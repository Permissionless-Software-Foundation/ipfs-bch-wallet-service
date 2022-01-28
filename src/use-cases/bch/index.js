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
    try {
      console.log(
        `getTransactions rpcData: ${JSON.stringify(rpcData, null, 2)}`
      )

      // Get the list of addresses.
      const addr = rpcData.payload.params.address

      // Default to descending sorting.
      let sortOrder = rpcData.payload.params.sortOrder
      if (!sortOrder) sortOrder = 'DESCENDING'
      // console.log('sortOrder: ', sortOrder)

      // Default to page 1
      let page = rpcData.payload.params.page
      if (!page) page = 0
      console.log('page: ', page)

      // Get the transaction history for the list of addresses.
      const data = await this.bchjs.Electrumx.transactions([addr])
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      if (!data.success) {
        throw new Error('Could not query Fulcrum indexer.')
      }
      // console.log(`transactions: ${JSON.stringify(transactions, null, 2)}`);

      // Sort the transactions.
      const txsArr = await this.bchjs.Electrumx.sortAllTxs(
        data.transactions[0].transactions,
        sortOrder
      )
      // console.log(`txsArr: ${JSON.stringify(txsArr, null, 2)}`)

      // Paginate the results
      const pagedResults = this.bchjs.Util.chunk100(txsArr)
      console.log(`pagedResults: ${JSON.stringify(pagedResults, null, 2)}`)

      const retObj = {
        address: addr,
        txs: pagedResults[page],
        status: 200,
        success: true
      }
      // console.log(`retObj: ${JSON.stringify(retObj, null, 2)}`)

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH transactions(): ', err)
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
}

module.exports = BCHUseCases
