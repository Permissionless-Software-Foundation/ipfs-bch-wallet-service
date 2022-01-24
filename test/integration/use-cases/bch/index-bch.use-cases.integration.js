/*
  Integration tests for the BCH Use Cases library
*/

// Local libraries
const BCHUseCases = require('../../../../src/use-cases/bch')
const Adapters = require('../../../../src/adapters')

describe('#BCH', () => {
  let uut

  before(async () => {
    const adapters = new Adapters()
    await adapters.start()

    uut = new BCHUseCases({ adapters })
  })

  describe('#getTransactions', () => {
    it('should get transactions for an address', async () => {
      const rpcData = {
        payload: {
          params: {
            addresses: ['bitcoincash:thing']
          }
        }
      }

      const result = await uut.getTransactions(rpcData)
      console.log('result: ', result)
    })
  })
})
