const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcrypt');

var encKey = process.env.ENC_KEY_32BYTE_BASE64;
var sigKey = process.env.SIG_KEY_64BYTE_BASE64;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true, // index field
  },
  passwordHash: {
    type: String,
    required: true,
  },
  bitcoinPortfolio: {
    satoshiAmount: Number, // integer number in satoshis
    bitcoinAveragePrice: Number, // decimal number with 2 decimals precision
  },
});

/*
userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["passwordHash"],
});
*/

const UserEntity = mongoose.model("User", userSchema);

module.exports = UserEntity;
