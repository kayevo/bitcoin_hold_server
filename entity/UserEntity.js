const mongoose = require('mongoose') 
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  bitcoinPortfolio: {
    satoshiAmount: Number, // integer number in satoshis
    bitcoinAveragePrice: Number, // decimal number with 2 decimals precision
  }
});

var encKey = process.env.ENC_KEY_32BYTE_BASE64
var sigKey = process.env.SIG_KEY_64BYTE_BASE64

userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['password']})

const UserEntity = mongoose.model('User', userSchema)

module.exports = UserEntity