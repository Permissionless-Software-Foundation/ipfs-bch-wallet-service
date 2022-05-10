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
    // await adapters.start()

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

  describe('#getTxData', () => {
    it('should get data for a single non-SLP tx', async () => {
      const txids = [
        '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f'
      ]

      const rpcData = {
        payload: {
          params: {
            txids
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.status, 200)
      assert.isArray(result.txData)
      assert.equal(result.txData.length, 1)
    })

    it('should get data on multiple non-SLP txs', async () => {
      const txids = [
        '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f',
        'f9b54fd8d27b0237923437ed4df8d45557f52b3ad4d8d03d4104e925c84ab4ca'
      ]

      const rpcData = {
        payload: {
          params: {
            txids
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result.status, 200)
      assert.isArray(result.txData)
      assert.equal(result.txData.length, 2)
    })
  })
})
