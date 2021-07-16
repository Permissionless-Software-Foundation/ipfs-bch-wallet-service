/*
  Unit tests for the REST API handler for the /users endpoints.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const adapters = require('../../../mocks/adapters')
const UseCasesMock = require('../../../mocks/use-cases')
// const app = require('../../../mocks/app-mock')

const BCHRESTController = require('../../../../../src/controllers/rest-api/bch/controller')
let uut
let sandbox
let ctx

const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#BCH-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new BCHRESTController({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new BCHRESTController()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating BCH REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new BCHRESTController({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating BCH REST Controller.'
        )
      }
    })
  })

  describe('#transactions', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves({ success: true })

      ctx.request.body = {
        addresses: 'testAddr'
      }

      await uut.transactions(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Electrumx, 'transactions')
          .rejects(new Error('test error'))

        ctx.request.body = {
          addresses: 'testAddr'
        }

        await uut.transactions(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#balance', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Electrumx, 'balance').resolves({ success: true })

      ctx.request.body = {
        addresses: 'testAddr'
      }

      await uut.balance(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Electrumx, 'balance')
          .rejects(new Error('test error'))

        ctx.request.body = {
          addresses: 'testAddr'
        }

        await uut.balance(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#utxos', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Utxo, 'get').resolves({ success: true })

      ctx.request.body = {
        addresses: 'testAddr'
      }

      await uut.utxos(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.bchjs.Utxo, 'get').rejects(new Error('test error'))

        ctx.request.body = {
          addresses: 'testAddr'
        }

        await uut.utxos(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#broadcast', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        .resolves({ success: true })

      ctx.request.body = {
        hex: 'testData'
      }

      await uut.broadcast(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .rejects(new Error('test error'))

        ctx.request.body = {
          hex: 'testData'
        }

        await uut.broadcast(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleError', () => {
    it('should pass an error message', () => {
      try {
        const err = {
          status: 422,
          message: 'Unprocessable Entity'
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'Unprocessable Entity')
      }
    })

    it('should still throw error if there is no message', () => {
      try {
        const err = {
          status: 404
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'Not Found')
      }
    })
  })
})
