/*
  Integration tests for the endpoints in controllers/json-rpc/bch
*/

// Global npm libraries
const assert = require('chai').assert

// Local libraries
const BCHController = require('../../../../src/controllers/json-rpc/bch')
const Adapters = require('../../../../src/adapters')
const UseCases = require('../../../../src/use-cases')

describe('#BCH', () => {
  let uut

  before(async () => {
    const adapters = new Adapters()
    const useCases = new UseCases({ adapters })
    // await adapters.start()

    uut = new BCHController({ adapters, useCases })
  })

  describe('#utxoIsValid', () => {
    it('should return true for valid UTXO with fullnode properties', async () => {
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
    })

    it('should return true for valid UTXO with fulcrum properties', async () => {
      const rpcData = {
        payload: {
          params: {
            utxo: {
              tx_hash: 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40',
              tx_pos: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result)

      assert.equal(result.isValid, true)
    })

    it('should return false for valid UTXO with fullnode properties', async () => {
      const rpcData = {
        payload: {
          params: {
            utxo: {
              txid: '17754221b29f189532d4fc2ae89fb467ad2dede30fdec4854eb2129b3ba90d7a',
              vout: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result)

      assert.equal(result.isValid, false)
    })

    it('should return false for valid UTXO with fulcrum properties', async () => {
      const rpcData = {
        payload: {
          params: {
            utxo: {
              tx_hash: '17754221b29f189532d4fc2ae89fb467ad2dede30fdec4854eb2129b3ba90d7a',
              tx_pos: 0
            }
          }
        }
      }

      const result = await uut.utxoIsValid(rpcData)
      // console.log('result: ', result

      assert.equal(result.isValid, false)
    })
  })

  describe('#getTokenData', () => {
    it('should return data for a token', async () => {
      const rpcData = {
        payload: {
          params: {
            tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
          }
        }
      }

      const result = await uut.getTokenData(rpcData)
      // console.log('result: ', result)

      // assert.equal(result.isValid, true)
      assert.property(result.tokenData, 'immutableData')
      assert.property(result.tokenData, 'mutableData')
      assert.equal(result.success, true)
    })

    it('should return data for a token with tx history', async () => {
      const rpcData = {
        payload: {
          params: {
            tokenId: '43eddfb11c9941edffb8c8815574bb0a43969a7b1de39ad14cd043eaa24fd38d',
            withTxHistory: true
          }
        }
      }

      const result = await uut.getTokenData(rpcData)
      // console.log('result: ', result)

      assert.isArray(result.tokenData.genesisData.txs)
    })
  })
})
