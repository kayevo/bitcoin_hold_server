const mongoose = require('mongoose') 

const UserEntity = mongoose.model('User', {
    email: String,
    password: String,
    bitcoinPortfolio: {
      satoshiAmount: Number, // integer number in satoshis
      averageBitcoinPrice: Number // decimal number with 2 decimals precision
    }
})

module.exports = UserEntity