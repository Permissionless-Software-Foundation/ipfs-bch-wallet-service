/*
  An end-to-end (e2e) test simulating a client connecting over IPFS and
  that exercises each JSON RPC endpoint.
*/

const TestUtils = require('./lib/test-utils')
const testUtils = new TestUtils()

const testData = require('./test-data.json')

async function startTest () {
  try {
    console.log('E2E TEST: Starting consumer E2E tests...')

    await testUtils.startIpfs()

    await testUtils.connectToUut(testData.uutAddr, testData.uutId)

    await testUtils.testBalance(testData.uutId)

    await testUtils.testTransaction(testData.uutId)

    console.log('E2E TEST: Tests completed successfully!')
    process.exit()
  } catch (err) {
    console.error('Error in startTest(): ', err)
  }
}
startTest()
