/*
  Clean Architecture Adapter for IPFS.
  This library deals with IPFS so that the apps business logic doesn't need
  to have any specific knowledge of the js-ipfs library.

  TODO: Add the external IP address to the list of multiaddrs advertised by
  this node. See this GitHub Issue for details:
  https://github.com/Permissionless-Software-Foundation/ipfs-service-provider/issues/38
*/

// Global npm libraries
// const IPFS = require('ipfs')
const IPFS = require('@chris.troutner/ipfs')

// Local libraries
const config = require('../../../config')

class IpfsAdapter {
  constructor (localConfig) {
    // Encapsulate dependencies
    this.IPFS = IPFS

    // Properties of this class instance.
    this.isReady = false
    this.config = config
  }

  // Start an IPFS node.
  async start () {
    try {
      // Ipfs Options
      const ipfsOptions = {
        repo: './.ipfsdata/ipfs',
        start: true,
        config: {
          relay: {
            enabled: true, // enable circuit relay dialer and listener
            hop: {
              enabled: true // enable circuit relay HOP (make this node a relay)
            }
          },
          pubsub: true, // enable pubsub
          Swarm: {
            ConnMgr: {
              HighWater: 30,
              LowWater: 10
            }
          },
          Addresses: {
            Swarm: [
              `/ip4/0.0.0.0/tcp/${this.config.ipfsTcpPort}`,
              `/ip4/0.0.0.0/tcp/${this.config.ipfsWsPort}/ws`
            ]
          }
        }
      }

      // Create a new IPFS node.
      this.ipfs = await this.IPFS.create(ipfsOptions)

      // Set the 'server' profile so the node does not scan private networks.
      await this.ipfs.config.profiles.apply('server')

      // Signal that this adapter is ready.
      this.isReady = true

      return this.ipfs
    } catch (err) {
      console.error('Error in ipfs.js/start()')
      throw err
    }
  }

  async stop () {
    await this.ipfs.stop()
  }
}

module.exports = IpfsAdapter
