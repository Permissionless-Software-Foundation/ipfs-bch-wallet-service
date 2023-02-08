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
        case 'txHistory':
          await this.rateLimit.limiter(rpcData.from)
          return await this.txHistory(rpcData)

        case 'balance':
          await this.rateLimit.limiter(rpcData.from)
          return await this.balance(rpcData)

        case 'utxos':
          await this.rateLimit.limiter(rpcData.from)
          return await this.utxos(rpcData)

        case 'utxosBulk':
          await this.rateLimit.limiter(rpcData.from)
          return await this.utxosBulk(rpcData)

        case 'broadcast':
          await this.rateLimit.limiter(rpcData.from)
          return await this.broadcast(rpcData)

        case 'txData':
          await this.rateLimit.limiter(rpcData.from)
          return await this.txData(rpcData)

        case 'pubkey':
          await this.rateLimit.limiter(rpcData.from)
          return await this.pubKey(rpcData)

        case 'utxoIsValid':
          await this.rateLimit.limiter(rpcData.from)
          return await this.utxoIsValid(rpcData)

        case 'getTokenData':
          await this.rateLimit.limiter(rpcData.from)
          return await this.getTokenData(rpcData)

        case 'getTokenData2':
          await this.rateLimit.limiter(rpcData.from)
          return await this.getTokenData2(rpcData)
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
   * @api {JSON} /bch TX History
   * @apiPermission public
   * @apiName txHistory
   * @apiGroup JSON BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   * It returns the transaction history for an address. This list of TXIDs is
   * sorted and paginated.
   *
   * There are three possible inputs:
   * - address: (required) the address to query for a transaction history
   * - sortOrder: (optional) will sort results in 'DECENDING' (default) or 'ASCENDING' order.
   * - page: (optional) will return a 'page' of 100 results. Default is 0
   *
   * Given the 'address' property this endpoint returns an object with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *    - method: "" - Method used in the petition
   *    - receiver: "" - Receiver address
   *    - value: {} - Final result value of the petition
   *      - success : - Petition status
   *      - txs : [] - Transactions of the provided address
   *        - height : - Reference to the blockchain size
   *        - tx_hash: "" - Hash of the transaction
   *      - address : "" - Address asociated to the transactions
   *      - status: - HTTP Status Code
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "txHistory", "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"], "sortOrder": "DESCENDING", "page": 0}}
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "jsonrpc":"2.0",
   *    "id":"555",
   *    "result":{
   *       "method":"bch",
   *       "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *       "value":{
   *          "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"
   *          "success":true,
   *          "txs":[
   *            {
   *              "height":631219,
   *              "tx_hash":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f"
   *            }
   *          ],
   *          "status":200
   *       }
   *    }
   * }
   */
  async txHistory (rpcData) {
    try {
      // console.log('transactions rpcData: ', rpcData)

      // const addr = rpcData.payload.params.address
      // const sortOrder = rpcData.payload.params.sortOrder

      const data = await this.useCases.bch.getTransactions(rpcData)

      return data
    } catch (err) {
      console.error('Error in JSON RPC BCH transactions()')
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'txHistory'
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
      console.error('Error in JSON RPC BCH balance()')
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
      // console.log('addr: ', addr)

      const data = await this.bchjs.Utxo.get(addr)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = data
      retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH utxos()')
      console.error('Error in JSON RPC utxos(): ', err)
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
   * @api {JSON} /bch UTXOs Bulk
   * @apiPermission public
   * @apiName UTXOs Bulk
   * @apiGroup JSON BCH
   * @apiDescription This endpoint provides the same data as as the utxos
   * endpoint, but it allows retrieval of UTXOs for up to 20 addresses at
   * a time. This reduces the number of JSON RPC calls, and is very handy
   * for HD wallets that need to quickly scan a lot of addresses.
   *
   *  Given an array of addresses, this endpoint will return an object
   *  with the following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the request with the RPC information
   *    - method: "" - Method used in the request
   *    - receiver: "" - Receiver address
   *    - value: [] - Final result value of the request
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
  async utxosBulk (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const addrs = rpcData.payload.params.addresses
      console.log('addrs: ', addrs)

      // Input validation
      if (!Array.isArray(addrs)) {
        throw new Error('addresses parameter must be an array')
      }
      if (addrs.length > 20) {
        throw new Error('addresses parameter must not exceed 20 elements')
      }

      const result = []
      for (let i = 0; i < addrs.length; i++) {
        const thisAddr = addrs[i]

        const data = await this.bchjs.Utxo.get(thisAddr)
        // console.log(`data: ${JSON.stringify(data, null, 2)}`)

        result.push({
          address: thisAddr,
          utxos: data
        })
      }
      console.log('result: ', result)

      const retObj = {}
      retObj.status = 200
      retObj.success = true
      retObj.data = result

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH utxosBulk()')
      console.error('Error in JSON RPC utxosBulk(): ', err)
      // throw err

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'utxosBulk'
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

      const retObj = {
        success: true,
        status: 200,
        endpoint: 'broadcast',
        txid: data
      }
      // retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH broadcast()')
      console.log('error: ', err)
      // throw err

      // bch-api will sometimes return an error message, not an error object.
      let message = ''
      if (!err.message && err.error) {
        // Full node error
        message = err.error
      } else {
        // Normal error
        message = err.message
      }

      // Return an error response
      return {
        success: false,
        status: 422,
        message,
        endpoint: 'broadcast'
      }
    }
  }

  /**
   * @api {JSON} /bch Transaction Data
   * @apiPermission public
   * @apiName txData
   * @apiGroup JSON BCH
   * @apiDescription Get expanded transaction data for an array of transaction
   * IDs. Each call is limited to 20 TXIDs or less.
   *
   * Given a transaction ID, the endpoint will return an object with the
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
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "txData", "txids": ["01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b"]}}
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "txData": [{
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
   *  }]
   */
  async txData (rpcData) {
    try {
      const retObj = await this.useCases.bch.getTxData(rpcData)
      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH txData()): ', err)

      // Return an error response
      return {
        success: false,
        status: 422,
        message: err.message,
        endpoint: 'txData'
      }
    }
  }

  /**
   * @api {JSON} /bch PubKey
   * @apiPermission public
   * @apiName PubKey
   * @apiGroup JSON BCH
   * @apiDescription Get the public key from an address.
   * Given an address the endpoint will return an object with the
   * following properties
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *      - success: - Request status
   *      - publickey: - Address public key
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "pubkey", "address": "bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk"}}
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "result":{
   *        "method":"bch",
   *        "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *        "value":{
   *          "success": true,
   *          "status": 200,
   *          "endpoint": "pubkey",
   *          "pubkey": {
   *            "success": true,
   *            "publicKey": "033f267fec0f7eb2b27f8c2e3052b3d03b09d36b47de4082ffb638ffb334ef0eee"
   *     }
   *
   *  }
   */
  async pubKey (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const address = rpcData.payload.params.address

      const data = await this.bchjs.encryption.getPubKey(address)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      const retObj = {
        success: true,
        status: 200,
        endpoint: 'pubkey',
        pubkey: data
      }
      // retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH pubKey()')

      // Handle different error formats.
      let error = err
      if (err.error && typeof err.error === 'string') {
        error = new Error(err.error)
      }

      // Return an error response
      return {
        success: false,
        status: 422,
        message: error.message,
        endpoint: 'pubkey'
      }
    }
  }

  /**
   * @api {JSON} /bch UtxoIsValid
   * @apiPermission public
   * @apiName UtxoIsValid
   * @apiGroup JSON BCH
   * @apiDescription Verify if UTXO is valid
   * Given a UTXO object (txid and vout), a full node is queried to verify that
   * the UTXO still exists in the mempool (true), or if it has been spent (false).
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *      - success: - Request status
   *      - isValid: - Boolean: true or false
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "utxoIsValid", "utxo": {"tx_hash": "17754221b29f189532d4fc2ae89fb467ad2dede30fdec4854eb2129b3ba90d7a", "tx_pos": 0}}}
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "result":{
   *        "method":"bch",
   *        "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *        "value":{
   *          "success": true,
   *          "status": 200,
   *          "endpoint": "utxoIsValid",
   *          "isValid": true
   *        }
   *     }
   *
   *  }
   */
  async utxoIsValid (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const utxo = rpcData.payload.params.utxo
      // console.log('utxo: ', utxo)

      const isValid = await this.bchjs.Utxo.isValid(utxo)

      const retObj = {
        success: true,
        status: 200,
        endpoint: 'utxoIsValid',
        isValid
      }
      // retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH utxoIsValid()')

      // Handle different error formats.
      let error = err
      if (err.error && typeof err.error === 'string') {
        error = new Error(err.error)
      }

      // Return an error response
      return {
        success: false,
        status: 422,
        message: error.message,
        endpoint: 'utxoIsValid'
      }
    }
  }

  /**
   * @api {JSON} /bch getTokenData
   * @apiPermission public
   * @apiName getTokenData
   * @apiGroup JSON BCH
   * @apiDescription Get data associated with a token
   * Given a token ID, this endpoint will retrieve the IPFS CIDs associated with
   * the tokens mutable and immutable data. This is extension of the PS002
   * specification for mutable data for tokens:
   * https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md
   *
   * If optional parameter 'withTxHistory' is true, data will include the
   * transaction history of the token.
   *
   *  - jsonrpc: "" - jsonrpc version
   *  - id: "" - jsonrpc id
   *  - result: {} - Result of the petition with the RPC information
   *      - success: - Request status
   *      - tokenData: - Address public key
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "getTokenData", "tokenId": "c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d", "withTxHistory": true }}
   *
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "jsonrpc":"2.0",
   *     "id":"555",
   *     "result":{
   *        "method":"bch",
   *        "reciever":"QmU86vLVbUY1UhziKB6rak7GPKRA2QHWvzNm2AjEvXNsT6",
   *        "value":{
   *          "success": true,
   *          "status": 200,
   *          "endpoint": "getTokenData",
   *          "tokenData": {
   *            "genesisData": {
   *              "type": 1,
   *              "ticker": 'MT2',
   *              "name": 'Mutable Token',
   *              "tokenId": 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d',
   *              "documentUri": 'ipfs://bafybeie7oxpsr7evcnlptecxfdhaqlot4732phukd2ekgvuzoir2frost4',
   *              "documentHash": '56ed1a5768076a318d02b5db64e125544dca57ab6b2cc7ca61dfa4645d244463',
   *              "decimals": 0,
   *              "mintBatonIsActive": true,
   *              "tokensInCirculationBN": '1000',
   *              "tokensInCirculationStr": '1000',
   *              "blockCreated": 739412,
   *              "totalBurned": '0',
   *              "totalMinted": '1000'
   *            },
   *            "immutableData": 'ipfs://bafybeie7oxpsr7evcnlptecxfdhaqlot4732phukd2ekgvuzoir2frost4',
   *            "mutableData": 'ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4'
   *          }
   *        }
   *     }
   *  }
   */
  async getTokenData (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const tokenId = rpcData.payload.params.tokenId
      // console.log('tokenId: ', tokenId)

      const withTxHistory = !!rpcData.payload.params.withTxHistory

      const tokenData = await this.bchjs.PsfSlpIndexer.getTokenData(tokenId, withTxHistory)

      const retObj = {
        success: true,
        status: 200,
        endpoint: 'getTokenData',
        tokenData
      }
      // retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH utxoIsValid()')

      // Handle different error formats.
      let error = err
      if (err.error && typeof err.error === 'string') {
        error = new Error(err.error)
      }

      // Return an error response
      return {
        success: false,
        status: 422,
        message: error.message,
        endpoint: 'getTokenData'
      }
    }
  }

  /**
   * @api {JSON} /bch getTokenData2
   * @apiPermission public
   * @apiName getTokenData2
   * @apiGroup JSON BCH
   * @apiDescription Get token icon and other media
   *
   * Get the icon for a token, given it's token ID.
   * This function expects a string input of a token ID property.
   * This function returns an object with a tokenIcon property that contains
   * the URL to the icon.
   *
   * The output object always have these properties:
   * - tokenIcon: A url to the token icon, if it exists.
   * - tokenStats: Data about the token from psf-slp-indexer.
   * - optimizedTokenIcon: An alternative, potentially more optimal, url to the token icon, if it exists.
   * - iconRepoCompatible: true if the token icon is available via token.bch.sx
   * - ps002Compatible: true if the token icon is compatible with PS007 specification.
   *
   * @apiExample Example usage:
   * {"jsonrpc":"2.0","id":"555","method":"bch","params":{ "endpoint": "getTokenData2", "tokenId": "c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d", "withTxHistory": true }}
   *
   */
  async getTokenData2 (rpcData) {
    try {
      // console.log('createUser rpcData: ', rpcData)

      const tokenId = rpcData.payload.params.tokenId
      // console.log('tokenId: ', tokenId)

      const updateCache = rpcData.payload.params.updateCache

      const tokenData = await this.bchjs.PsfSlpIndexer.getTokenData2(tokenId, updateCache)

      const retObj = {
        success: true,
        status: 200,
        endpoint: 'getTokenData2',
        tokenData
      }
      // retObj.status = 200

      return retObj
    } catch (err) {
      console.error('Error in JSON RPC BCH utxoIsValid()')

      // Handle different error formats.
      let error = err
      if (err.error && typeof err.error === 'string') {
        error = new Error(err.error)
      }

      // Return an error response
      return {
        success: false,
        status: 422,
        message: error.message,
        endpoint: 'getTokenData2'
      }
    }
  }
}

module.exports = BCHRPC
