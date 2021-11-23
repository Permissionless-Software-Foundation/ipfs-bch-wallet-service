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

    it('should route to the balance method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'balance').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'balance'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should route to the utxos method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'utxos').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxos'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should route to the broadcast method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'broadcast').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'broadcast'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should route to the transaction method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'transaction').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transaction'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })
    it('should route to the pubkey method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'pubKey').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'pubkey'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
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

  describe('#utxos', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Utxo, 'get').resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxos',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxos(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid address', async () => {
      // Force an error
      sandbox.stub(uut.bchjs.Utxo, 'get').rejects(new Error('Invalid address'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxos',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxos(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid address')
      assert.equal(response.endpoint, 'utxos')
    })
  })

  describe('#broadcast', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        .resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'broadcast',
        hex: 'testData'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.broadcast(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid input', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        .rejects(new Error('Invalid data'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'broadcast',
        hex: 'testHex'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.broadcast(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid data')
      assert.equal(response.endpoint, 'broadcast')
    })
  })

  describe('#transaction', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Transaction, 'get').resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transaction',
        txid: 'testData'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.transaction(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid input', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.Transaction, 'get')
        .rejects(new Error('Invalid data'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'transaction',
        txid: 'testTxid'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.transaction(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid data')
      assert.equal(response.endpoint, 'transaction')
    })
  })

  describe('#pubKey', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      const mock = { success: true, publicKey: '033f267fec0f7eb2b27f8c2e3052b3d03b09d36b47de4082ffb638ffb334ef0eee' }
      sandbox.stub(uut.bchjs.encryption, 'getPubKey').resolves(mock)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'pubkey',
        address: 'bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.pubKey(rpcData)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)

      assert.property(response, 'pubkey')

      const pubKey = response.pubkey
      assert.property(pubKey, 'publicKey')
      assert.equal(pubKey.publicKey, mock.publicKey)
    })
    it('should throw an error if public key is not found', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.encryption, 'getPubKey')
        .rejects({ success: false, error: 'No transaction history.' })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'pubkey',
        address: 'bitcoincash:qrnx7l2e6yejgswehf54gs30ljzumnhqdqgn8yscr2'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.pubKey(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'No transaction history.')
      assert.equal(response.endpoint, 'pubkey')
    })
    it('should return an error for invalid input', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.encryption, 'getPubKey')
        .rejects(new Error('Invalid data'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'pubkey',
        address: 'bitcoincash'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.pubKey(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid data')
      assert.equal(response.endpoint, 'pubkey')
    })
  })
})
