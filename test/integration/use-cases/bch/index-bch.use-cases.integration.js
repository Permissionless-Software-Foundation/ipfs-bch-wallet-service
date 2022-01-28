/*
  Integration tests for the BCH Use Cases library
*/

// Global npm libraries
const assert = require('chai').assert

// Local libraries
const BCHUseCases = require('../../../../src/use-cases/bch')
const Adapters = require('../../../../src/adapters')

describe('#BCH', () => {
  let uut

  before(async () => {
    const adapters = new Adapters()
    await adapters.start()

    uut = new BCHUseCases({ adapters })
  })

  describe('#getTransactions', () => {
    it('should get transactions for an address, with default descending sorting', async () => {
      const rpcData = {
        payload: {
          params: {
            address: 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.isArray(result.txs)

      // Assert descending sort order.
      assert.isAbove(result.txs[0].height, result.txs[1].height)
    })

    it('should get transactions for an address, with explicit descending sorting', async () => {
      const rpcData = {
        payload: {
          params: {
            address: 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v',
            sortOrder: 'DESCENDING'
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.isArray(result.txs)

      // Assert descending sort order.
      assert.isAbove(result.txs[0].height, result.txs[1].height)
    })

    it('should sort in ascending order', async () => {
      const rpcData = {
        payload: {
          params: {
            address: 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v',
            sortOrder: 'ASCENDING'
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.isArray(result.txs)

      // Assert descending sort order.
      assert.isAbove(result.txs[1].height, result.txs[0].height)
    })
  })
})
