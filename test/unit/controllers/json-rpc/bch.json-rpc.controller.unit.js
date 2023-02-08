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
    it('should route to the txHistory method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'txHistory').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txHistory'
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

    it('should route to the utxosBulk method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'utxosBulk').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxosBulk'
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

    it('should route to the txData method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'txData').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txData'
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

    it('should route to the utxoIsValid method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'utxoIsValid').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxoIsValid'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should route to the getTokenData method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'getTokenData').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'getTokenData'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should route to the getTokenData2 method', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'getTokenData2').resolves(true)

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'getTokenData2'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result, true)
    })

    it('should return 500 status on routing issue', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'txHistory').rejects(new Error('test error'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txHistory'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)
      rpcData.from = 'Origin request'

      const result = await uut.bchRouter(rpcData)

      assert.equal(result.success, false)
      assert.equal(result.status, 500)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'txHistory')
    })
  })

  describe('#txHistory', () => {
    it('should return data from bchjs', async () => {
      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txHistory',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.txHistory(rpcData)
      console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid address', async () => {
      // Force an error
      sandbox
        .stub(uut.useCases.bch, 'getTransactions')
        .rejects(new Error('Invalid address'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const txCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txHistory',
        addresses: 'testAddr'
      })
      const jsonStr = JSON.stringify(txCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.txHistory(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid address')
      assert.equal(response.endpoint, 'txHistory')
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
        address: 'testAddr'
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
        address: 'testAddr'
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

  describe('#utxosBulk', () => {
    it('should return UTXO data from bchjs for multiple addresses', async () => {
      // Mock dependencies
      sandbox.stub(uut.bchjs.Utxo, 'get').resolves({ success: true })

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxosBulk',
        addresses: ['testAddr1', 'testAddr2']
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxosBulk(rpcData)
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
        endpoint: 'utxosBulk',
        addresses: ['testAddr1', 'testAddr2']
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxosBulk(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid address')
      assert.equal(response.endpoint, 'utxosBulk')
    })

    it('should throw error if input is not an array', async () => {
      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxosBulk',
        addresses: 'singleAddress'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxosBulk(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'addresses parameter must be an array')
      assert.equal(response.endpoint, 'utxosBulk')
    })

    it('should throw error if input array is larger than 20 elements', async () => {
      // Generate an array larger than 20 elements
      const inputArray = []
      for (let i = 0; i < 25; i++) {
        inputArray.push(i)
      }

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'utxosBulk',
        addresses: inputArray
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.utxosBulk(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'addresses parameter must not exceed 20 elements')
      assert.equal(response.endpoint, 'utxosBulk')
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

    it('should return an error if full node returns a string error', async () => {
      // Force an error
      sandbox
        .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
        // .rejects(new Error('Invalid data'))
        .rejects({error: 'Invalid data'})

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

  describe('#txData', () => {
    it('should route data to the use-case library', async () => {
      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txData',
        txid: 'testData'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.txData(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, true)
      assert.equal(response.status, 200)
    })

    it('should return an error for invalid input', async () => {
      // Force an error
      sandbox
        .stub(uut.useCases.bch, 'getTxData')
        .rejects(new Error('Invalid data'))

      // Generate the parsed data that the main router would pass to this
      // endpoint.
      const id = uid()
      const rpcCall = jsonrpc.request(id, 'bch', {
        endpoint: 'txData',
        txid: 'testTxid'
      })
      const jsonStr = JSON.stringify(rpcCall, null, 2)
      const rpcData = jsonrpc.parse(jsonStr)

      const response = await uut.txData(rpcData)
      // console.log('response: ', response)

      assert.equal(response.success, false)
      assert.equal(response.status, 422)
      assert.equal(response.message, 'Invalid data')
      assert.equal(response.endpoint, 'txData')
    })
  })

  describe('#pubKey', () => {
    it('should return data from bchjs', async () => {
      // Mock dependencies
      const mock = {
        success: true,
        publicKey:
          '033f267fec0f7eb2b27f8c2e3052b3d03b09d36b47de4082ffb638ffb334ef0eee'
      }
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

  describe('#utxoIsValid', () => {
    it('should return false if UTXO.isValid() returns false', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Utxo, 'isValid')
        .resolves(false)

      const rpcData = {
        payload: {
          params: {
            utxo: {
              txid: 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40',
              vout: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result)

      assert.equal(result.isValid, false)
      assert.equal(result.success, true)
    })

    it('should return true if UTXO.isValid() returns true', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Utxo, 'isValid')
        .resolves(true)

      const rpcData = {
        payload: {
          params: {
            utxo: {
              txid: 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40',
              vout: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result)

      assert.equal(result.isValid, true)
      assert.equal(result.success, true)
    })

    it('should catch and return errors', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.Utxo, 'isValid')
        // .rejects(new Error('test error'))
        .rejects({error: 'test error'})

      const rpcData = {
        payload: {
          params: {
            utxo: {
              txid: 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40',
              vout: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'utxoIsValid')
    })
  })

  describe('#getTokenData', () => {
    it('should return data from PsfSlpIndexer.getTokenData()', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'getTokenData')
        .resolves({ a: 'b' })

      const rpcData = {
        payload: {
          params: {
            tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
          }
        }
      }

      const result = await uut.getTokenData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'getTokenData')
      assert.property(result, 'tokenData')
    })

    it('should catch and return errors', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'getTokenData')
        // .rejects(new Error('test error'))
        .rejects({error: 'test error'})

      const rpcData = {
        payload: {
          params: {
            tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
          }
        }
      }

      const result = await uut.getTokenData(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'getTokenData')
    })
  })

  describe('#getTokenData2', () => {
    it('should return data from PsfSlpIndexer.getTokenData2()', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'getTokenData2')
        .resolves({ a: 'b' })

      const rpcData = {
        payload: {
          params: {
            tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
          }
        }
      }

      const result = await uut.getTokenData2(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, true)
      assert.equal(result.status, 200)
      assert.equal(result.endpoint, 'getTokenData2')
      assert.property(result, 'tokenData')
    })

    it('should catch and return errors', async () => {
      // Mock dependencies
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'getTokenData2')
        // .rejects(new Error('test error'))
        .rejects({error: 'test error'})

      const rpcData = {
        payload: {
          params: {
            tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
          }
        }
      }

      const result = await uut.getTokenData2(rpcData)
      // console.log('result: ', result)

      assert.equal(result.success, false)
      assert.equal(result.status, 422)
      assert.equal(result.message, 'test error')
      assert.equal(result.endpoint, 'getTokenData2')
    })
  })
})
