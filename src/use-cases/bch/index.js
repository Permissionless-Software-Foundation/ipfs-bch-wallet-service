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
      // console.log(
      //   `getTransactions rpcData: ${JSON.stringify(rpcData, null, 2)}`
      // )

      // Get the list of addresses.
      const addr = rpcData.payload.params.address

      // Default to descending sorting.
      let sortOrder = rpcData.payload.params.sortOrder
      if (!sortOrder) sortOrder = 'DESCENDING'
      // console.log('sortOrder: ', sortOrder)

      // Default to page 1
      let page = rpcData.payload.params.page
      if (!page) page = 0
      // console.log('page: ', page)

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
      // console.log(
      //   `pagedResults[page]: ${JSON.stringify(pagedResults[page], null, 2)}`
      // )

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
        endpoint: 'txHistory'
      }
    }
  }

  // Get transaction data for an array of TXIDs.
  async getTxData (rpcData) {
    try {
      // console.log('transaction rpcData: ', rpcData)

      const txids = rpcData.payload.params.txids
      // console.log(`txids: ${JSON.stringify(txids, null, 2)}`)

      if (!Array.isArray(txids)) {
        return {
          success: false,
          status: 422,
          message: 'Input txids must be an array of transaction IDs.',
          endpoint: 'txData'
        }
      }

      if (txids.length > 20) {
        return {
          success: false,
          status: 422,
          message: 'Array input must be 20 elements or less.',
          endpoint: 'txData'
        }
      }

      const txData = []
      for (let i = 0; i < txids.length; i++) {
        const thisTxid = txids[i]

        console.log(`this.bchjs.restURL: ${this.bchjs.restURL}`)
        const data = await this.bchjs.Transaction.get(thisTxid.toString())
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        txData.push(data.txData)
      }

      const retObj = {
        status: 200,
        txData
      }

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH getTxData(): ', err)
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'txData'
      }
    }
  }
}

module.exports = BCHUseCases
