/*
  An end-to-end (e2e) test simulating a client connecting over IPFS and
  that exercises each JSON RPC endpoint.
*/

const TestUtils = require('./lib/test-utils')
const testUtils = new TestUtils()

const testData = require('./test-data.json')

async function startTest () {
  try {
    await testUtils.startIpfs()

    await testUtils.connectToUut(testData.uutAddr)
  } catch (err) {
    console.error('Error in startTest(): ', err)
  }
}
startTest()
