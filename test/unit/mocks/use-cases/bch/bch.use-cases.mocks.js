/*
  Mock data for use-cases/bch/index.js unit tests
*/

const fulcrumOut01 = {
  success: true,
  transactions: [
    {
      transactions: [
        {
          height: 560430,
          tx_hash:
            '3e1f3e882be9c03897eeb197224bf87f312be556a89f4308fabeeeabcf9bc851'
        },
        {
          height: 560534,
          tx_hash:
            '4ebbeaac51ce141e262964e3a0ce11b96ca72c0dffe9b4127ce80135f503a280'
        }
      ],
      address: 'bitcoincash:qpdh9s677ya8tnx7zdhfrn8qfyvy22wj4qa7nwqa5v'
    }
  ]
}

const txData01 = {
  txData: {
    txid: '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f',
    hash: '11384d7e5a8af93806591debe5bbe2d7826aeea987b874dfbe372dfdcc0ee54f',
    version: 1,
    size: 371,
    locktime: 0,
    vin: [
      {
        txid: 'c4f3e3d6f146f1d54bd5c22cad6b189637b44a655b057cd0303d85558c033594',
        vout: 310,
        scriptSig: {
          asm: '304402200d40ad599c7e33c7f5245080c0ea35c837c0d142b82eb6824fceaf049c2a355902200590e35951111f6c603c0fb4e513cf0e47734d7bc8b45f105585bea0f2b923de[ALL|FORKID] 0352ede8ab8f2ae49b3921c385e59f700ae1e6f73cbb37f61cd1244e70c99bf496',
          hex: '47304402200d40ad599c7e33c7f5245080c0ea35c837c0d142b82eb6824fceaf049c2a355902200590e35951111f6c603c0fb4e513cf0e47734d7bc8b45f105585bea0f2b923de41210352ede8ab8f2ae49b3921c385e59f700ae1e6f73cbb37f61cd1244e70c99bf496'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qzgkqac0tlrfsajg2f7e4e8nyh3glmn4s523tysd6r',
        value: 0.08809511
      },
      {
        txid: 'c32265f89b2d5d1d5ffd5212b3245105d7d0ba726306fbeb93cd866ce0fd2d61',
        vout: 1,
        scriptSig: {
          asm: '3045022100be9cc5e982110b0f563460baa19a42f34ab775708ad3461a6cf065db9dffb1b7022031ffb2721828be4aa1f4967a367e8af2848cdfce41c68565d0a2a2a70117ea5d[ALL|FORKID] 02d2eabc002e25fc08622a71d9ef96c17b21176f438d67bc537ac49a2e0e594372',
          hex: '483045022100be9cc5e982110b0f563460baa19a42f34ab775708ad3461a6cf065db9dffb1b7022031ffb2721828be4aa1f4967a367e8af2848cdfce41c68565d0a2a2a70117ea5d412102d2eabc002e25fc08622a71d9ef96c17b21176f438d67bc537ac49a2e0e594372'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qr92r3ms2696ghpmk9467px90jrzzdesy5fmqc05p3',
        value: 0.00011805
      }
    ],
    vout: [
      {
        value: 0.0814,
        n: 0,
        scriptPubKey: {
          asm: 'OP_HASH160 84459c796307fe2c0316ce7a8bffc511c27bcd55 OP_EQUAL',
          hex: 'a91484459c796307fe2c0316ce7a8bffc511c27bcd5587',
          reqSigs: 1,
          type: 'scripthash',
          addresses: ['bitcoincash:pzzyt8revvrlutqrzm884zllc5guy77d2545uyqe8h']
        }
      },
      {
        value: 0.00680944,
        n: 1,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 aab2f091ea97e02c58c4e27fb77afb99538ea39e OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a914aab2f091ea97e02c58c4e27fb77afb99538ea39e88ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['bitcoincash:qz4t9uy3a2t7qtzccn38ldm6lwv48r4rnc9mxdtvt9']
        }
      }
    ],
    hex: '01000000029435038c55853d30d07c055b654ab43796186bad2cc2d54bd5f146f1d6e3f3c4360100006a47304402200d40ad599c7e33c7f5245080c0ea35c837c0d142b82eb6824fceaf049c2a355902200590e35951111f6c603c0fb4e513cf0e47734d7bc8b45f105585bea0f2b923de41210352ede8ab8f2ae49b3921c385e59f700ae1e6f73cbb37f61cd1244e70c99bf496ffffffff612dfde06c86cd93ebfb066372bad0d7055124b31252fd5f1d5d2d9bf86522c3010000006b483045022100be9cc5e982110b0f563460baa19a42f34ab775708ad3461a6cf065db9dffb1b7022031ffb2721828be4aa1f4967a367e8af2848cdfce41c68565d0a2a2a70117ea5d412102d2eabc002e25fc08622a71d9ef96c17b21176f438d67bc537ac49a2e0e594372ffffffff02e0347c000000000017a91484459c796307fe2c0316ce7a8bffc511c27bcd5587f0630a00000000001976a914aab2f091ea97e02c58c4e27fb77afb99538ea39e88ac00000000',
    blockhash:
      '000000000000000001e8e99be82172d5fe913e21f5a78e4e3bdce2c7dc6315ce',
    confirmations: 94517,
    time: 1586584650,
    blocktime: 1586584650,
    isValidSlp: false
  }
}

module.exports = {
  fulcrumOut01,
  txData01
}
