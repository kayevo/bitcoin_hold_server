const mongoose = require("mongoose");
const fieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var encryptionKey = process.env.DATABASE_ENCRYPTION_KEY;

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
    totalPaidPrice: Number, // decimal number with 2 decimals precision
  },
});

userSchema.plugin(fieldEncryption, {
  secret: encryptionKey,
  fields: ["bitcoinPortfolio", "passwordHash"],
});

const UserEntity = mongoose.model("User", userSchema);

module.exports = UserEntity;
