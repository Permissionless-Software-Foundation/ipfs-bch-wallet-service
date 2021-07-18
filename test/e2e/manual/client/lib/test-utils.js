/*
  A class library of test utility functions.
*/

const BCHJS = require('@psf/bch-js')
const IpfsCoord = require('ipfs-coord')
const IPFS = require('ipfs')

class TestUtils {
  constructor (localConfig = {}) {
    this.bchjs = new BCHJS()
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
        privateLog: console.log, // Default to console.log
        isCircuitRelay: false,
        apiInfo: 'none',
        announceJsonLd: announceJsonLd
      })
      await this.ipfsCoord.ipfs.start()
      await this.ipfsCoord.isReady()
    } catch (err) {
      console.error('Error in startIpfs().')
      throw err
    }
  }

  async connectToUut (addr) {
    try {
      await this.ipfs.swarm.connect(addr)
      console.log(`Connected to IPFS node ${addr}`)
    } catch (err) {
      console.error('Error in connectToUut()')
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
