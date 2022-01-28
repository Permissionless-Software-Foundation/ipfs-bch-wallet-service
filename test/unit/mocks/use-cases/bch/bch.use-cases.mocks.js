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

module.exports = {
  fulcrumOut01
}
