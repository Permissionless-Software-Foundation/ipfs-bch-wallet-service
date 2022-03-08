/*
  Unit tests for the IPFS Adapter.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const IPFSLib = require('../../../src/adapters/ipfs/ipfs')
const IPFSMock = require('../mocks/ipfs-mock')

describe('#IPFS-adapter', () => {
  let uut
  let sandbox

  beforeEach(() => {
    uut = new IPFSLib()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#start', () => {
    it('should return a promise that resolves into an instance of IPFS.', async () => {
      // Mock dependencies.
      uut.IPFS = IPFSMock

      const result = await uut.start()
      // console.log('result: ', result)

      assert.equal(uut.isReady, true)

      assert.property(result, 'config')
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox.stub(uut.IPFS, 'create').rejects(new Error('test error'))

        await uut.start()

        assert.fail('Unexpected code path.')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#stop', () => {
    it('should stop the IPFS node', async () => {
      // Mock dependencies
      uut.ipfs = {
        stop: () => {
        }
      }

      const result = await uut.stop()

      assert.equal(result, true)
    })
  })

// describe('#rmBlocksDir', () => {
//   it('should delete the /blocks directory', () => {
//     const result = uut.rmBlocksDir()
//
//     assert.equal(result, true)
//   })
//
//   it('should catch and throw an error', () => {
//     try {
//       // Force an error
//       sandbox.stub(uut.fs, 'rmdirSync').throws(new Error('test error'))
//
//       uut.rmBlocksDir()
//
//       assert.fail('Unexpected code path')
//     } catch (err) {
//       assert.equal(err.message, 'test error')
//     }
//   })
// })
})
