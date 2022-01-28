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
})
