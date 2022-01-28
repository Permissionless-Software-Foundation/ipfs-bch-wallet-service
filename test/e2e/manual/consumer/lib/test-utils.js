/*
  A class library of test utility functions.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')
const IpfsCoord = require('ipfs-coord')
const IPFS = require('ipfs-http-client')
const EventEmitter = require('events')
const { v4: uid } = require('uuid')
const jsonrpc = require('jsonrpc-lite')
const http = require('http')

let _this

class TestUtils {
  constructor (localConfig = {}) {
    // Encapsulate dependencies.
    this.bchjs = new BCHJS()
    this.eventEmitter = new EventEmitter()
    this.uid = uid
    this.jsonrpc = jsonrpc

    _this = this
  }

  // This handler function recieves data from other ipfs-coord peers, like
  // the ipfs-bch-wallet-service that we're testing.
  // It emits the data as an 'rpcData' event. The tests will listen for this
  // event.
  rpcHandler (inData) {
    try {
      // console.log('Data recieved by rpcHandler: ', inData)

      const jsonData = JSON.parse(inData)

      _this.eventEmitter.emit('rpcData', jsonData)
    } catch (err) {
      console.error('Error in rpcHandler: ', err)
      // Do not throw an error. This is a top-level function.
    }
  }

  // Send the RPC command to the service, wait a period of time for a response.
  // Timeout if a response is not recieved.
  async sendRPC (ipfsId, cmdStr) {
    try {
      // Send the RPC command to the server/service.
      // await this.ipfsCoord.ipfs.orbitdb.sendToDb(ipfsId, cmdStr)
      await this.ipfsCoord.useCases.peer.sendPrivateMessage(
        ipfsId,
        cmdStr,
        this.ipfsCoord.thisNode
      )

      let retData

      // This event is triggered when the response comes back.
      this.eventEmitter.on('rpcData', (inData) => {
        retData = inData
      })

      // Used for calculating the timeout.
      const start = new Date()
      let now = start
      let timeDiff = 0

      // Wait for the response from the server. Exit once the response is
      // recieved, or a timeout occurs.
      do {
        await this.bchjs.Util.sleep(1000)

        now = new Date()

        timeDiff = now.getTime() - start.getTime()
        // console.log('timeDiff: ', timeDiff)
      } while (
        // Exit once the RPC data comes back, or if a period of time passes.
        !retData || // eslint-disable-line no-unmodified-loop-condition
        timeDiff > 10000
      )

      return retData
    } catch (err) {
      console.error('Error in sendRPC')
      throw err
    }
  }

  async startIpfs () {
    try {
      const ipfsOptionsExternal = {
        host: 'localhost',
        port: 5001,
        agent: http.Agent({ keepAlive: true, maxSockets: 2000 })
      }

      // Start the IPFS node.
      this.ipfs = await IPFS.create(ipfsOptionsExternal)
      await this.ipfs.config.profiles.apply('server')

      // Start ipfs-coord.
      this.ipfsCoord = new IpfsCoord({
        ipfs: this.ipfs,
        type: 'node.js',
        // type: 'browser',
        bchjs: this.bchjs,
        privateLog: this.rpcHandler, // Default to console.log
        isCircuitRelay: false,
        apiInfo: 'none',
        announceJsonLd: announceJsonLd,
        nodeType: 'external'
      })

      await this.ipfsCoord.start()

      // Wait to let ipfs-coord connect to subnet peers.
      await this.bchjs.Util.sleep(30000)
    } catch (err) {
      console.error('Error in startIpfs().')
      throw err
    }
  }

  // Connect to the unit under test (uut)
  async connectToUut (addr, ipfsId) {
    try {
      try {
        await this.ipfs.swarm.connect(addr)
        console.log(`E2E TEST: Connected to IPFS node ${addr}`)
      } catch (err) {
        throw new Error('Could not connect to UUT IPFS node.')
      }

      // console.log(
      //   'ipfs-coord peer info: ',
      //   this.ipfsCoord.ipfs.peers.state.peers[ipfsId]
      // )

      const peers = this.ipfsCoord.thisNode.peerList
      // console.log('peers: ', peers)
      // console.log('Target peer in peerList? ', peers.includes(ipfsId))

      // if (!this.ipfsCoord.ipfs.peers.state.peers[ipfsId]) {
      if (!peers.includes(ipfsId)) {
        throw new Error('Could not find UUT in ipfs-coord list of peers.')
      }
    } catch (err) {
      console.log(err)
      console.error('Error in connectToUut()')
      console.log(
        'Is the service running? Did you update the test-data.json file?'
      )
      process.exit()
    }
  }

  // Get the balance for a BCH address over JSON RPC.
  async testBalance (ipfsId) {
    try {
      // Generate the JSON RPC command
      const id = uid()
      const cmd = jsonrpc.request(id, 'bch', {
        endpoint: 'balance',
        addresses: ['bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj']
      })
      const cmdStr = JSON.stringify(cmd)

      // console.log(`Publishing message to ${ipfsId}`)

      console.log('E2E TEST: Sending Balance command...')
      const result = await this.sendRPC(ipfsId, cmdStr)
      // console.log('result: ', result)

      if (result.result.value.success && result.result.value.balances) {
        console.log('E2E TEST: balance test passed.')
        return true
      } else {
        console.log('E2E TEST: balance test failed.')
        this.failTest()
      }
    } catch (err) {
      console.error('Error in testBalance()')
      throw err
    }
  }

  // Get the info a on transaction over JSON RPC.
  async testTransaction (ipfsId) {
    try {
      // Generate the JSON RPC command
      const id = uid()
      const cmd = jsonrpc.request(id, 'bch', {
        endpoint: 'transaction',
        txid: '01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b'
      })
      const cmdStr = JSON.stringify(cmd)

      // console.log(`Publishing message to ${ipfsId}`)

      console.log('E2E TEST: Sending Transaction command...')
      const result = await this.sendRPC(ipfsId, cmdStr)
      // console.log('result: ', result)

      if (result.result.value.status && result.result.value.confirmations) {
        console.log('E2E TEST: transaction test passed.')
        return true
      } else {
        console.log('E2E TEST: transaction test failed.')
        this.failTest()
      }
    } catch (err) {
      console.error('Error in testTransaction()')
      throw err
    }
  }

  // Get the info a on transaction over JSON RPC.
  async testTransactions (ipfsId) {
    try {
      // Generate the JSON RPC command
      const id = uid()
      const cmd = jsonrpc.request(id, 'bch', {
        endpoint: 'transactions',
        address: 'bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj'
      })
      const cmdStr = JSON.stringify(cmd)

      // console.log(`Publishing message to ${ipfsId}`)

      console.log('E2E TEST: Sending Transactions command...')
      const result = await this.sendRPC(ipfsId, cmdStr)
      // console.log('result: ', result)

      if (
        result.result.value.status &&
        Array.isArray(result.result.value.transactions)
      ) {
        console.log('E2E TEST: transactions test passed.')
        return true
      } else {
        console.log('E2E TEST: transactions test failed.')
        this.failTest()
      }
    } catch (err) {
      console.error('Error in testTransactions()')
      throw err
    }
  }

  // Get the utxos for a BCH address over JSON RPC.
  async testUtxos (ipfsId) {
    try {
      // Generate the JSON RPC command
      const id = uid()
      const cmd = jsonrpc.request(id, 'bch', {
        endpoint: 'utxos',
        address: 'bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj'
      })
      const cmdStr = JSON.stringify(cmd)

      // console.log(`Publishing message to ${ipfsId}`)

      console.log('E2E TEST: Sending Utxos command...')
      const result = await this.sendRPC(ipfsId, cmdStr)
      // console.log('result', result.result.value)

      const bchUtxos = result.result.value[0].bchUtxos
      const slpUtxos = result.result.value[0].slpUtxos

      if (result.result.value && bchUtxos && slpUtxos) {
        console.log('E2E TEST: utxos test passed.')
        return true
      } else {
        console.log('E2E TEST: utxos test failed.')
        this.failTest()
      }
    } catch (err) {
      console.error('Error in testUtxos()')
      throw err
    }
  }

  failTest () {
    console.log('Exiting test program.')
    process.exit()
  }
}

const announceJsonLd = {
  '@context': 'https://schema.org/',
  '@type': 'WebAPI',
  name: 'e2e-test-client',
  description: 'A test client runing e2e tests on ipfs-bch-wallet-service.',
  documentation: 'https://ipfs-bch-wallet-service.fullstack.cash/',
  provider: {
    '@type': 'Organization',
    name: 'Permissionless Software Foundation',
    url: 'https://PSFoundation.cash'
  }
}

module.exports = TestUtils
