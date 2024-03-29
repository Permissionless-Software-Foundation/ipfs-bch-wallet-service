/*
  Unit tests for the REST API handler for the /users endpoints.
*/

// Public npm libraries
// const assert = require('chai').assert
// const sinon = require('sinon')
import sinon from 'sinon'
import { assert } from 'chai'

// Local support libraries
import adapters from '../../../mocks/adapters/index.js'
import UseCasesMock from '../../../mocks/use-cases/index.js'
// const app = require('../../../mocks/app-mock')

import BCHRESTController from '../../../../../src/controllers/rest-api/bch/controller.js'

import { context as mockContext } from '../../../../unit/mocks/ctx-mock.js'
let uut
let sandbox
let ctx

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

  describe('#transaction', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Transaction, 'get').resolves({ success: true })

      ctx.request.body = {
        txid: 'testData'
      }

      await uut.transaction(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.Transaction, 'get')
          .rejects(new Error('test error'))

        ctx.request.body = {
          txid: 'testData'
        }

        await uut.transaction(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#pubKey', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      const mock = { success: true, publicKey: '033f267fec0f7eb2b27f8c2e3052b3d03b09d36b47de4082ffb638ffb334ef0eee' }
      sandbox.stub(uut.bchjs.encryption, 'getPubKey').resolves(mock)

      ctx.params = {
        address: 'bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk'
      }

      await uut.pubKey(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
      assert.equal(ctx.body.publicKey, mock.publicKey)
    })
    it('should throw an error if public key is not found', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.encryption, 'getPubKey')
          .rejects({ success: false, error: 'No transaction history.' })

        ctx.params = {
          address: 'bitcoincash:qrnx7l2e6yejgswehf54gs30ljzumnhqdqgn8yscr2'
        }
        await uut.pubKey(ctx)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'No transaction history')
      }
    })
    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.encryption, 'getPubKey')
          .rejects(new Error('test error'))

        ctx.params = {
          address: 'bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk'
        }
        await uut.pubKey(ctx)
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
