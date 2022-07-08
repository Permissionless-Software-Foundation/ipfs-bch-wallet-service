/*
  Unit tests for controllers index.js file.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

const Controllers = require('../../../src/controllers')

describe('#Controllers', () => {
  let uut
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new Controllers()
  })

  afterEach(() => sandbox.restore())

  describe('#attachControllers', () => {
    it('should attach the controllers', async () => {
      // mock dependencies
      // sandbox.stub(adapters.fullStackJwt, 'getJWT').resolves({})
      // sandbox.stub(adapters.fullStackJwt, 'instanceBchjs').resolves({})
      // sandbox.stub(adapters.ipfs, 'start').resolves({})
      // adapters.ipfs.ipfsCoordAdapter = {

      sandbox.stub(uut.adapters, 'start').resolves({})
      uut.adapters.ipfs.ipfsCoordAdapter = {
        attachRPCRouter: () => {}
      }

      const app = {
        use: () => {}
      }

      await uut.attachControllers(app)

      assert.isOk(true, 'Not throwing an error is a success')
    })

    it('should catch and throw errors', async () => {
      try {
        // Force an error
        sandbox.stub(uut, 'attachRPCControllers').throws(new Error('test error'))

        const app = {
          use: () => {}
        }

        await uut.attachControllers(app)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log('err.message: ', err.message)
        assert.include(err.message, 'test error')
      }
    })
  })
})
