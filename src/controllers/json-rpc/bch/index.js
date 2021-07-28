/*
  This is the JSON RPC router for the Fulcrum API
*/

// Public npm libraries
const jsonrpc = require('jsonrpc-lite')
// const BCHJS = require('@psf/bch-js')

// Local libraries
// const UserLib = require('../../../use-cases/user')
const Validators = require('../validators')
const RateLimit = require('../rate-limit')

class BCHRPC {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating BCH JSON RPC Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating BCH JSON RPC Controller.'
      )
    }

    // Encapsulate dependencies
    this.userLib = this.useCases.user
    this.jsonrpc = jsonrpc
    this.validators = new Validators(localConfig)
    this.rateLimit = new RateLimit()
    // this.bchjs = new BCHJS()
    this.bchjs = this.adapters.bchjs
  }

  // Top-level router for this library. All other methods in this class are for
  // a specific endpoint. This method routes incoming calls to one of those
  // methods.
  async bchRouter (rpcData) {
    let endpoint = 'unknown'
    try {
      // console.log('fulcrumRouter rpcData: ', rpcData)

      endpoint = rpcData.payload.params.endpoint
      // let user

      // Route the call based on the value of the method property.
      switch (endpoint) {
        case 'transactions':
          await this.rateLimit.limiter(rpcData.from)
          return await this.transactions(rpcData)

        case 'balance':
          await this.rateLimit.limiter(rpcData.from)
          return await this.balance(rpcData)

        case 'utxos':
          await this.rateLimit.limiter(rpcData.from)
          return await this.utxos(rpcData)

        case 'broadcast':
          await this.rateLimit.limiter(rpcData.from)
          return await this.broadcast(rpcData)

        case 'transaction':
          await this.rateLimit.limiter(rpcData.from)
          return await this.transaction(rpcData)
      }
    } catch (err) {
      console.error('Error in BCHRPC/rpcRouter()')
      // throw err

      return {
        success: false,
        status: err.status || 500,
        message: err.message,
        endpoint
      }
    }
  }

  /**
   * @api {JSON} /bch Transactions
   * @apiPermission public
   * @apiName Transactions
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   * Given the 'addresses' property this endpoint returns an object with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: {} - Final result value of the petition
   *      - success : - Petition status
   *      - transactions : [] - Transactions of the provided adresses
   *        - transactions: [] - Transaction details
   *          - height : - Reference to the blockchain size
   *          - tx_hash: "" - Hash of the transaction
   *        - address : "" - Address asociated to the transactions
   *      - status: - HTTP Status Code
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "transactions", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "jsonrpc":"2.0",
   *    "id":"555",
   *    "result":{
   *       "method":"bch",
   *       "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *       "value":{
   *          "success":true,
   *          "transactions":[
   *             {
   *                "transactions":[
   *                   {
   *                      "height":631219,
   *                      "tx_hash":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f"
   *                   }
   *                ],
   *                "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"
   *             }
   *          ],
   *          "status":200
   *       }
   *    }
   * }
   */
  async transactions (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addrs = rpcData.payload.params.addresses

      const data = await this.bchjs.Electrumx.transactions(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'transactions'
      }
    }
  }

  /**
   * @api {JSON} /bch Balance
   * @apiPermission public
   * @apiName Balance
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.balance([]) function.
   *
   *  Given the 'addresses' property it returns an object
   *  with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: {} - Final result value of the petition
   *      - success : - Petition status
   *      - balances : [] - Balance of the provided addresses
   *        - balance : {} - Object with the balance types of an address
   *          - confirmed : - Confirmed balance
   *          - unconfirmed : - Unconfirmed balance
   *        - address : "" - Address related to the balance
   *      - status: - HTTP Status Code
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "balance", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"]}}
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "jsonrpc":"2.0",
   *    "id":"555",
   *    "result":{
   *       "method":"bch",
   *       "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *       "value":{
   *          "success":true,
   *          "balances":[
   *             {
   *                "balance":{
   *                   "confirmed":1000,
   *                   "unconfirmed":0
   *                },
   *                "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"
   *             }
   *          ],
   *          "status":200
   *       }
   *    }
   * }
   */
  async balance (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addrs = rpcData.payload.params.addresses

      const data = await this.bchjs.Electrumx.balance(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'balance'
      }
    }
  }

  /**
   * @api {JSON} /bch UTXOs
   * @apiPermission public
   * @apiName UTXOs
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Utxos.get() function. This
   * endpoint returns UTXOs held at an address, hydrated
   * with token information.
   *
   *  Given an address this endpoint will return an object
   *  with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: [] - Final result value of the petition
   *      - address: "" - the address these UTXOs are associated with
   *      - bchUtxos: [] - UTXOs confirmed to be spendable as normal BCH
   *      - nullUtxo: [] - UTXOs that did not pass SLP validation. Should be ignored and
   *        not spent, to be safe.
   *      - slpUtxos: {} - UTXOs confirmed to be colored as valid SLP tokens
   *        - type1: {}
   *          - tokens: [] - SLP token Type 1 tokens.
   *          - mintBatons: [] - SLP token Type 1 mint batons.
   *        - nft: {}
   *          - tokens: [] - NFT tokens
   *          - groupTokens: [] - NFT Group tokens, used to create NFT tokens.
   *          - groupMintBatons: [] - Minting baton to create more NFT Group tokens.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "utxos", "address": "bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"}}
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *    "jsonrpc":"2.0",
   *    "id":"555",
   *    "result":{
   *       "method":"bch",
   *       "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *       "value":[
   *          {
   *             "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj",
   *             "bchUtxos":[
   *                {
   *                   "height":631219,
   *                   "tx_hash":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f",
   *                   "tx_pos":0,
   *                   "value":1000,
   *                   "txid":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f",
   *                   "vout":0,
   *                   "isValid":false
   *                }
   *             ],
   *             "nullUtxos":[
   *
   *             ],
   *             "slpUtxos":{
   *                "type1":{
   *                   "mintBatons":[
   *
   *                   ],
   *                   "tokens":[
   *
   *                   ]
   *                },
   *                "nft":{
   *                   "groupMintBatons":[
   *
   *                   ],
   *                   "groupTokens":[
   *
   *                   ],
   *                   "tokens":[
   *
   *                   ]
   *                }
   *             }
   *          }
   *       ]
   *    }
   * }
   *
   */
  async utxos (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addr = rpcData.payload.params.address

      const data = await this.bchjs.Utxo.get(addr)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'utxos'
      }
    }
  }

  /**
   * @api {JSON} /bch Broadcast
   * @apiPermission public
   * @apiName Broadcast
   * @apiGroup JSON BCH
   * @apiDescription Broadcast a transaction to the BCH network.
   * The transaction should be encoded as a hexidecimal string.
   *
   * This endpoint will return an object with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: "" - Final result value of the petition
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "broadcast", "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000"}}
   *
   * @apiSuccessExample {json} Success-Response:
   *
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "result":{
   *        "method":"bch",
   *        "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *        "value": "951299775f68a599b95239bfc385423f87a33e11747c299a22ef9dcf3d1557ec"
   *
   */
  async broadcast (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const hex = rpcData.payload.params.hex

      const data = await this.bchjs.RawTransactions.sendRawTransaction(hex)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'broadcast'
      }
    }
  }

  /**
   * @api {JSON} /bch Transaction
   * @apiPermission public
   * @apiName Transaction
   * @apiGroup JSON BCH
   * @apiDescription Get data about a specific transaction.
   * Given a transaction the endpoint will return an object with the
   * following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: {} - Final result value of the petition
   *      - txid: "" - Transaction ID
   *      - hash: "" - Transaction hash
   *      - version: - Version number
   *      - size: - Transaction size
   *      - locktime: -
   *      - vin: [] - Transaction inputs
   *      - vout: [] - Transaction outputs
   *      - hex: "" - hexadecimal script
   *      - blockhash: "" - Reference to the block register
   *      - confirmations : "" - Transaction confirmations
   *      - time: - Execution time
   *      - blocktime: - Execution time
   *      - isValidSLPTx: - Determines if the transaction was under SLP
   *      - status: - HTTP Status Code
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "transaction", "txid": "01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b"}}
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "result":{
   *        "method":"bch",
   *        "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *        "value":{
   *           "txid":"01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b",
   *           "hash":"01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b",
   *           "version":1,
   *           "size":272,
   *           "locktime":0,
   *           "vin":[
   *              {
   *                 "txid":"4deef6de4b973706cd6e8fc8105a41a84be349e4e9717225ee5e7c63538e95e8",
   *                 "vout":1,
   *                 "scriptSig":{
   *                    "asm":"3045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f2496[ALL|FORKID] 0467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3",
   *                    "hex":"483045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f249641410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3"
   *                 },
   *                 "sequence":4294967295,
   *                 "address":"bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq",
   *                 "value":0.00001824
   *              }
   *           ],
   *           "vout":[
   *              {
   *                 "value":0,
   *                 "n":0,
   *                 "scriptPubKey":{
   *                    "asm":"OP_RETURN -385055325 46226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a",
   *                    "hex":"6a045d7af3962046226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a",
   *                    "type":"nulldata"
   *                 }
   *              },
   *              {
   *                 "value":0.0000155,
   *                 "n":1,
   *                 "scriptPubKey":{
   *                    "asm":"OP_DUP OP_HASH160 066ebee590278f32aedc8a4865700c49e717f1d7 OP_EQUALVERIFY OP_CHECKSIG",
   *                    "hex":"76a914066ebee590278f32aedc8a4865700c49e717f1d788ac",
   *                    "reqSigs":1,
   *                    "type":"pubkeyhash",
   *                    "addresses":[
   *                       "bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq"
   *                    ]
   *                 }
   *              }
   *           ],
   *           "hex":"0100000001e8958e53637c5eee257271e9e449e34ba8415a10c88f6ecd0637974bdef6ee4d010000008b483045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f249641410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3ffffffff020000000000000000276a045d7af3962046226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a0e060000000000001976a914066ebee590278f32aedc8a4865700c49e717f1d788ac00000000",
   *           "blockhash":"0000000000000000008e8d83cba6d45a9314bc2ef4538d4e0577c6bed8593536",
   *           "confirmations":98000,
   *           "time":1568338904,
   *           "blocktime":1568338904,
   *           "isValidSLPTx":false,
   *           "status":200
   *        }
   *     }
   *  }
   */
  async transaction (rpcData) {
    try {
      // console.log('transaction rpcData: ', rpcData)

      const txid = rpcData.payload.params.txid

      const data = await this.bchjs.Transaction.get(txid.toString())
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      // console.error('Error in createUser()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'transaction'
      }
    }
  }
}

module.exports = BCHRPC
