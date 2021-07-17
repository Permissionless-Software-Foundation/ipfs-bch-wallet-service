/*
  Mocks for the Adapter library.
*/

const ipfs = {
  ipfsAdapter: {
    ipfs: {}
  },
  ipfsCoordAdapter: {
    ipfsCoord: {}
  }
}

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
    balance: () => {}
  },
  Utxo: {
    get: () => {}
  },
  Transaction: {
    get: () => {}
  },
  RawTransactions: {
    sendRawTransaction: () => {}
  }
}

module.exports = { ipfs, localdb, bchjs }
