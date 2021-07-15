/*
  Unit tests for the json-rpc/auth/index.js file.
*/

// Public npm libraries
const jsonrpc = require('jsonrpc-lite')
const sinon = require('sinon')
const assert = require('chai').assert
const { v4: uid } = require('uuid')

// Set the environment variable to signal this is a test.
process.env.SVC_ENV = 'test'

// Local libraries
const BCHRPC = require('../../../../src/controllers/json-rpc/bch')
const RateLimit = require('../../../../src/controllers/json-rpc/rate-limit')
const adapters = require('../../mocks/adapters')
const UseCasesMock = require('../../mocks/use-cases')

describe('#BCHRPC', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    const useCases = new UseCasesMock()

    uut = new BCHRPC({ adapters, useCases })
    uut.rateLimit = new RateLimit({ max: 100 })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new BCHRPC()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating BCH JSON RPC Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new BCHRPC({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating BCH JSON RPC Controller.'
        )
      }
    })
  })

  describe('#bchRouter', () => {
    it('should route to the transactions method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'transactions').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transactions'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should return 500 status on routing issue', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'transactions').rejects(new Error('test error'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transactions'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result.success, false)
      assert.equal(result.status, 500)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'transactions')
    })
  })

  describe('#transactions', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transactions',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.transactions(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid address', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .rejects(new Error('Invalid address'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transactions',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.transactions(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid address')
      assert.equal(response.endpoint, 'transactions')
    })
  })

  describe('#balance', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Electrumx, 'balance').resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'balance',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.balance(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid address', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Electrumx, 'balance')
        .rejects(new Error('Invalid address'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'balance',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.balance(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid address')
      assert.equal(response.endpoint, 'balance')
    })
  })
})
