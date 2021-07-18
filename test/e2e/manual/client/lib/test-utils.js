/*
  A class library of test utility functions.
*/

const BCHJS = require('@psf/bch-js')
const IpfsCoord = require('ipfs-coord')
const IPFS = require('ipfs')
const EventEmitter = require('events')

let _this

class TestUtils {
  constructor (localConfig = {}) {
    this.bchjs = new BCHJS()
    this.eventEmitter = new EventEmitter()

    _this = this
  }

  rpcHandler (inData) {
    try {
      console.log('inData: ', inData)

      _this.eventEmitter.emit('rpcData', inData)
    } catch (err) {
      console.error('Error in rpcHandler: ', err)
      // Do not throw an error. This is a top-level function.
    }
  }

  async sendRPC (ipfsId, cmdStr) {
    try {
      await this.ipfsCoord.ipfs.orbitdb.sendToDb(ipfsId, cmdStr)

      let retData

      this.eventEmitter.on('rpcData', inData => {
        retData = inData
      })

      const start = new Date()
      let now = start
      let timeDiff = 0

      do {
        await this.bchjs.Util.sleep(1000)

        now = new Date()

        timeDiff = now.getTime() - start.getTime()
        console.log('timeDiff: ', timeDiff)
      } while (!retData || timeDiff > 10000) // eslint-disable-line no-unmodified-loop-condition

      return retData
    } catch (err) {
      console.error('Error in sendRPC')
      throw err
    }
  }

  async startIpfs () {
    try {
      // Start the IPFS node.
      this.ipfs = await IPFS.create()
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
        announceJsonLd: announceJsonLd
      })
      await this.ipfsCoord.ipfs.start()
      await this.ipfsCoord.isReady()

      // Wait to let ipfs-coord connect to subnet peers.
      await this.bchjs.Util.sleep(30000)
    } catch (err) {
      console.error('Error in startIpfs().')
      throw err
    }
  }

  async connectToUut (addr) {
    try {
      await this.ipfs.swarm.connect(addr)
      console.log(`E2E TEST: Connected to IPFS node ${addr}`)
    } catch (err) {
      console.error('Error in connectToUut()')
      throw err
    }
  }

  // Get the balance for a BCH address over JSON RPC.
  async getBalance (ipfsId) {
    try {
      const cmd = {
        jsonrpc: '2.0',
        id: '832',
        method: 'bch',
        params: {
          endpoint: 'balance',
          addresses: ['bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj']
        }
      }
      const cmdStr = JSON.stringify(cmd)

      console.log(
        'ipfs-coord peer info: ',
        this.ipfsCoord.ipfs.peers.state.peers[ipfsId]
      )

      console.log(`Publishing message to ${ipfsId}`)
      // await this.ipfsCoord.ipfs.pubsub.publishToPubsubChannel(ipfsId, cmdStr)
      // await this.ipfsCoord.ipfs.orbitdb.sendToDb(ipfsId, cmdStr)
      const result = await this.sendRPC(ipfsId, cmdStr)
      console.log('E2E TEST: Balance command sent.')

      console.log('result: ', result)
    } catch (err) {
      console.error('Error in getBalance()')
      throw err
    }
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
