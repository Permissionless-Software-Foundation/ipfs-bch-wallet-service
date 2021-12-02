/*
  Controller for the /fulcrum REST API endpoints.
*/

// const BCHJS = require('@psf/bch-js')

let _this

class BCHRESTController {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating BCH REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating BCH REST Controller.'
      )
    }

    // this.bchjs = new BCHJS()
    this.bchjs = this.adapters.bchjs

    _this = this
  }

  /**
   *
   * @api {post} /bch/transactions Transactions
   * @apiName Transactions
   * @apiGroup REST BCH
   * @apiDescription This endpoint wraps the bchjs.Electrumx.transactions([]) function.
   *
   *  Given the 'addresses' property returns an array of objects
   *  with the following properties
   *
   *  - success : - Petition status
   *  - transactions : [] - Transaction of the provided address
   *    - transactions: [] - Transaction details
   *      - height : - Reference to the blockchain size
   *      - tx_hash: "" - Transaction hash
   *    - address : "" - Address associated to the transactions
   *
   *  Note: For a single address pass the 'addresses' of string type
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"] }' localhost:5001/bch/transactions
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success":true,
   *        "transactions":[
   *           {
   *              "transactions":[
   *                 {
   *                    "height":631219,
   *                    "tx_hash":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f"
   *                 }
   *              ],
   *              "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"
   *           }
   *        ]
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */

  async transactions (ctx) {
    try {
      const addrs = ctx.request.body.addresses

      const data = await _this.bchjs.Electrumx.transactions(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      ctx.body = data
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/balance Balance
   * @apiName Balance
   * @apiGroup REST BCH
   * @apiDescription Returns the balance of an address or an array of addresses.
   *
   *  Given the 'addresses' property returns an array of objects
   *  with the following properties
   *
   *  - success : - Petition status
   *  - balances : [] - Balance of the provided addresses
   *    - balance : {} - Object with the balance types of an address
   *      - confirmed : - Confirmed balance
   *      - unconfirmed : - Unconfirmed Balance
   *    - address : "" - Address related to the balance
   *
   *  Note: For a single address pass the 'addresses' of string type
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "addresses": ["bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"] }' localhost:5001/bch/balance
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success":true,
   *        "balances":[
   *           {
   *              "balance":{
   *                 "confirmed":1000,
   *                 "unconfirmed":0
   *              },
   *              "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj"
   *           }
   *        ]
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async balance (ctx) {
    try {
      const addrs = ctx.request.body.addresses

      const data = await _this.bchjs.Electrumx.balance(addrs)
      // console.log(`data: ${JSON.stringify(data, null, 2)}`)

      ctx.body = data
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/utxos UTXOs
   * @apiName UTXOs
   * @apiGroup REST BCH
   * @apiDescription This endpoint returns UTXOs held at an address, hydrated
   *  with token information.
   *
   *  Given an address, this endpoint will return an object with thre following
   *  properties:
   *
   *  - address: "" - the address these UTXOs are associated with
   *  - bchUtxos: [] - UTXOs confirmed to be spendable as normal BCH
   *  - nullUtxo: [] - UTXOs that did not pass SLP validation. Should be ignored and
   *    not spent, to be safe.
   *  - slpUtxos: {} - UTXOs confirmed to be colored as valid SLP tokens
   *    - type1: {}
   *      - tokens: [] - SLP token Type 1 tokens.
   *      - mintBatons: [] - SLP token Type 1 mint batons.
   *    - nft: {}
   *      - tokens: [] - NFT tokens
   *      - groupTokens: [] - NFT Group tokens, used to create NFT tokens.
   *      - groupMintBatons: [] - Minting baton to create more NFT Group tokens.
   *
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "address": "bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj" }' localhost:5001/bch/utxos
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     [
   *        {
   *           "address":"bitcoincash:qrl2nlsaayk6ekxn80pq0ks32dya8xfclyktem2mqj",
   *           "bchUtxos":[
   *              {
   *                 "height":631219,
   *                 "tx_hash":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f",
   *                 "tx_pos":0,
   *                 "value":1000,
   *                 "txid":"ae2daa01c8172545b5edd205ea438706bcb74e63d4084a26b9ff2a46d46dc97f",
   *                 "vout":0,
   *                 "isValid":false
   *              }
   *           ],
   *           "nullUtxos":[
   *
   *           ],
   *           "slpUtxos":{
   *              "type1":{
   *                 "mintBatons":[
   *
   *                 ],
   *                 "tokens":[
   *
   *                 ]
   *              },
   *              "nft":{
   *                 "groupMintBatons":[
   *
   *                 ],
   *                 "groupTokens":[
   *
   *                 ],
   *                 "tokens":[
   *
   *                 ]
   *              }
   *           }
   *        }
   *     ]
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async utxos (ctx) {
    try {
      const address = ctx.request.body.address

      const utxos = await _this.bchjs.Utxo.get(address)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      ctx.body = utxos
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/broadcast Broadcast
   * @apiName Broadcast
   * @apiGroup REST BCH
   * @apiDescription Broadcast a transaction to the BCH network.
   * The transaction should be encoded as a hexidecimal string.
   *
   * This endpoint will return a transaction id
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "hex": "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0704ffff001d0104ffffffff0100f2052a0100000043410496b538e853519c726a2c91e61ec11600ae1390813a627c66fb8be7947be63c52da7589379515d4e0a604f8141781e62294721166bf621e73a82cbf2342c858eeac00000000" }' localhost:5001/bch/broadcast
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     "951299775f68a599b95239bfc385423f87a33e11747c299a22ef9dcf3d1557ec"
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async broadcast (ctx) {
    try {
      const hex = ctx.request.body.hex

      const txid = await _this.bchjs.RawTransactions.sendRawTransaction(hex)
      // console.log(`txid: ${JSON.stringify(txid, null, 2)}`)

      ctx.body = txid
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/transaction Transaction
   * @apiName Transaction
   * @apiGroup REST BCH
   * @apiDescription Get data about a specific transaction.
   * Given a transaction id this endpoint will return an object
   * with the following properties
   *
   * - txid: "" - Transaction ID
   * - hash: "" - Transaction hash
   * - version: - Version number
   * - size: - Transaction size
   * - locktime: -
   * - vin: [] - Transaction inputs
   * - vout: [] - Transaction outputs
   * - hex: "" - hexadecimal script
   * - blockhash: "" - Reference to the block register
   * - confirmations : "" - Transaction confirmations
   * - time: - Execution time
   * - blocktime: - Execution time
   * - isValidSLPTx: - Determines if the transaction was under SLP
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "txid": "01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b" }' localhost:5001/bch/transaction
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   * {
   *    "txid":"01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b",
   *    "hash":"01517ff1587fa5ffe6f5eb91c99cf3f2d22330cd7ee847e928ce90ca95bf781b",
   *    "version":1,
   *    "size":272,
   *    "locktime":0,
   *    "vin":[
   *       {
   *          "txid":"4deef6de4b973706cd6e8fc8105a41a84be349e4e9717225ee5e7c63538e95e8",
   *          "vout":1,
   *          "scriptSig":{
   *             "asm":"3045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f2496[ALL|FORKID] 0467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3",
   *             "hex":"483045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f249641410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3"
   *          },
   *          "sequence":4294967295,
   *          "address":"bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq",
   *          "value":0.00001824
   *       }
   *    ],
   *    "vout":[
   *       {
   *          "value":0,
   *          "n":0,
   *          "scriptPubKey":{
   *             "asm":"OP_RETURN -385055325 46226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a",
   *             "hex":"6a045d7af3962046226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a",
   *             "type":"nulldata"
   *          }
   *       },
   *       {
   *          "value":0.0000155,
   *          "n":1,
   *          "scriptPubKey":{
   *             "asm":"OP_DUP OP_HASH160 066ebee590278f32aedc8a4865700c49e717f1d7 OP_EQUALVERIFY OP_CHECKSIG",
   *             "hex":"76a914066ebee590278f32aedc8a4865700c49e717f1d788ac",
   *             "reqSigs":1,
   *             "type":"pubkeyhash",
   *             "addresses":[
   *                "bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq"
   *             ]
   *          }
   *       }
   *    ],
   *    "hex":"0100000001e8958e53637c5eee257271e9e449e34ba8415a10c88f6ecd0637974bdef6ee4d010000008b483045022100fce6ef975fa7ec66e0ce0c51d839fd8f56510897252c0b238e7265974bc7c07202200d1d1429154e6775eecdc2829965650bc3ca714a86088d705bd58f8c034f249641410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3ffffffff020000000000000000276a045d7af3962046226800369048b83cea897639bb39273c8e4b883bd8c2a435bbe7a237cc433a0e060000000000001976a914066ebee590278f32aedc8a4865700c49e717f1d788ac00000000",
   *    "blockhash":"0000000000000000008e8d83cba6d45a9314bc2ef4538d4e0577c6bed8593536",
   *    "confirmations":97988,
   *    "time":1568338904,
   *    "blocktime":1568338904,
   *    "isValidSLPTx":false
   * }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async transaction (ctx) {
    try {
      const txid = ctx.request.body.txid

      const data = await _this.bchjs.Transaction.get(txid)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      ctx.body = data
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {post} /bch/pubkey PubKey
   * @apiName PubKey
   * @apiGroup REST BCH
   * @apiDescription Get the public key from an address
   *
   *  Given the 'address' param returns an object
   *  with the following properties
   *
   *  - success : - Request status
   *  - publicKey : '' - Public key of the provided address
   *
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5001/bch/pubkey/bitcoincash:qpnty9t0w93fez04h7yzevujpv8pun204qv6yfuahk
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "success":true,
   *        "publicKey": '033f267fec0f7eb2b27f8c2e3052b3d03b09d36b47de4082ffb638ffb334ef0eee'
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async pubKey (ctx) {
    try {
      const address = ctx.params.address
      console.log(`pubKey address: ${address}`)

      const pubkey = await _this.bchjs.encryption.getPubKey(address)
      // console.log(`pubkey: ${JSON.stringify(pubkey, null, 2)}`)

      ctx.body = pubkey
    } catch (err) {
      console.log(err)
      let error = err
      if (err.error && typeof err.error === 'string') {
        error = new Error(err.error)
      }
      _this.handleError(ctx, error)
    }
  }

  // DRY error handler
  handleError (ctx, err) {
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }
}
module.exports = BCHRESTController
