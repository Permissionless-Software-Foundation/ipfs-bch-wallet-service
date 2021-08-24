/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

/* eslint  no-unneeded-ternary:0 */

// Get the version from the package.json file.
const pkgInfo = require('../../package.json')
const version = pkgInfo.version

const ipfsCoordName = process.env.COORD_NAME
  ? process.env.COORD_NAME
  : 'ipfs-bch-wallet-service'

module.exports = {
  // Configure TCP port.
  port: process.env.PORT || 5001,

  // Password for HTML UI that displays logs.
  logPass: 'test',

  // Email server settings if nodemailer email notifications are used.
  emailServer: process.env.EMAILSERVER
    ? process.env.EMAILSERVER
    : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER
    ? process.env.EMAILUSER
    : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS
    ? process.env.EMAILPASS
    : 'emailpassword',

  // FullStack.cash account information, used for automatic JWT handling.
  getJwtAtStartup: false,
  authServer: process.env.AUTHSERVER
    ? process.env.AUTHSERVER
    : 'https://auth.fullstack.cash',
  apiServer: process.env.APISERVER
    ? process.env.APISERVER
    : 'https://api.fullstack.cash/v5/',
  fullstackLogin: process.env.FULLSTACKLOGIN
    ? process.env.FULLSTACKLOGIN
    : 'demo@demo.com',
  fullstackPassword: process.env.FULLSTACKPASS
    ? process.env.FULLSTACKPASS
    : 'demo',

  // IPFS settings.
  isCircuitRelay: process.env.ENABLE_CIRCUIT_RELAY ? true : false,

  // Information passed to other IPFS peers about this node.
  apiInfo: 'https://ipfs-bch-wallet-service.fullstack.cash/',

  ipfsCoordName: ipfsCoordName,

  // JSON-LD and Schema.org schema with info about this app.
  announceJsonLd: {
    '@context': 'https://schema.org/',
    '@type': 'WebAPI',
    name: ipfsCoordName,
    version,
    protocol: 'bch-wallet',
    description:
      'IPFS service providing BCH blockchain access needed by a wallet.',
    documentation: 'https://ipfs-bch-wallet-service.fullstack.cash/',
    provider: {
      '@type': 'Organization',
      name: 'Permissionless Software Foundation',
      url: 'https://PSFoundation.cash'
    }
  },

  // IPFS Ports
  ipfsTcpPort: process.env.IPFS_TCP_PORT ? process.env.IPFS_TCP_PORT : 5668,
  ipfsWsPort: process.env.IPFS_WS_PORT ? process.env.IPFS_WS_PORT : 5669
}
