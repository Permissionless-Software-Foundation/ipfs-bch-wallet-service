/*
  Unit tests for the BCH Use Cases
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const clone = require('lodash.clonedeep')

// Local support libraries
const BCHUseCases = require('../../../../src/use-cases/bch')
const adapters = require('../../mocks/adapters')
const mockDataLib = require('../../mocks/use-cases/bch/bch.use-cases.mocks.js')

describe('#bch-use-case', () => {
  let uut
  let sandbox
  let mockData

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    mockData = clone(mockDataLib)

    uut = new BCHUseCases({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new BCHUseCases()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating BCH Use Cases library.'
        )
      }
    })
  })

  describe('#getTransactions', () => {
    it('should get transactions for an address', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves(mockData.fulcrumOut01)
      sandbox
        .stub(uut.bchjs.Electrumx, 'sortAllTxs')
        .resolves(mockData.fulcrumOut01.transactions[0].transactions)
      sandbox
        .stub(uut.bchjs.Util, 'chunk100')
        .returns([mockData.fulcrumOut01.transactions[0].transactions])

      const address = 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
      const rpcData = {
        payload: {
          params: {
            address
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log('result: ', result)

      // Assert expected values and properties.
      assert.equal(result.address, address)
      assert.equal(result.status, 200)
      assert.equal(result.success, true)
      assert.isArray(result.txs)
    })

    it('should return error if Fulcrum communication is not possible', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves({ success: false })

      const address = 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
      const rpcData = {
        payload: {
          params: {
            address
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.message, 'Could not query Fulcrum indexer.')
      assert.equal(result.endpoint, 'transactions')
    })

    it('should return error if there is an error', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .rejects(new Error('test error'))

      const address = 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
      const rpcData = {
        payload: {
          params: {
            address
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'transactions')
    })
  })

  describe('#getTxData', () => {
    it('should get tx data', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Transaction, 'get').resolves(mockData.txData01)

      const rpcData = {
        payload: {
          params: {
            txids: [
              '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f'
            ]
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.status, 200)
      assert.isArray(result.txData)
    })

    it('should return error if txids is not an array', async () => {
      const rpcData = {
        payload: {
          params: {
            txids: 1234
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.endpoint, 'transaction')
      assert.equal(
        result.message,
        'Input txids must be an array of transaction IDs.'
      )
    })

    it('should return error if txids array has more than 20 elements', async () => {
      const rpcData = {
        payload: {
          params: {
            txids: [
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25
            ]
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.endpoint, 'transaction')
      assert.equal(result.message, 'Array input must be 20 elements or less.')
    })

    it('should handle errors', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Transaction, 'get')
        .rejects(new Error('test error'))

      const rpcData = {
        payload: {
          params: {
            txids: [
              '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f'
            ]
          }
        }
      }

      const result = await uut.getTxData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.endpoint, 'transaction')
      assert.equal(result.message, 'test error')
    })
  })
})
