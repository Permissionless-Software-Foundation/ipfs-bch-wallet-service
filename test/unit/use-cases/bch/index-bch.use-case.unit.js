/*
  Unit tests for the BCH Use Cases
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const BCHUseCases = require('../../../../src/use-cases/bch')
const adapters = require('../../mocks/adapters')

describe('#bch-use-case', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

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
      const rpcData = {
        payload: {
          params: {
            addresses: [
              'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
            ]
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      console.log('result: ', result)
    })
  })
})
