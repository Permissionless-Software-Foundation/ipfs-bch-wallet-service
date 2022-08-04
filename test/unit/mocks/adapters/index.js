/*
  Mocks for the Adapter library.
*/

class IpfsAdapter {
  constructor () {
    this.ipfs = {
      files: {
        stat: () => {}
      }
    }
  }
}

class IpfsCoordAdapter {
  constructor () {
    this.ipfsCoord = {
      useCases: {
        peer: {
          sendPrivateMessage: () => {}
        }
      }
    }
  }
}

const ipfs = {
  ipfsAdapter: new IpfsAdapter(),
  ipfsCoordAdapter: new IpfsCoordAdapter()
}
ipfs.ipfs = ipfs.ipfsAdapter.ipfs

const localdb = {
  Users: class Users {
    static findById () {}
    static find () {}
    static findOne () {
      return {
        validatePassword: localdb.validatePassword
      }
    }

    async save () {
      return {}
    }

    generateToken () {
      return '123'
    }

    toJSON () {
      return {}
    }

    async remove () {
      return true
    }

    async validatePassword () {
      return true
    }
  },

  validatePassword: () => {
    return true
  }
}

const bchjs = {
  Electrumx: {
    transactions: () => {},
    balance: () => {},
    sortAllTxs: () => {}
  },
  Utxo: {
    get: () => {},
    isValid: () => true
  },
  Transaction: {
    get: () => {}
  },
  RawTransactions: {
    sendRawTransaction: () => {}
  },
  encryption: {
    getPubKey: () => {}
  },
  Util: {
    chunk100: () => {}
  },
  PsfSlpIndexer: {
    getTokenData: () => {}
  }
}

module.exports = { ipfs, localdb, bchjs }
