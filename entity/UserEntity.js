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
  bitcoinPortfolio:{ 
    amount: {  // integer number in satoshis unit
      type: Number,
      required: false,
    },
    averagePrice: { // decimal number with 2 decimals precision per bitcoin price
      type: Number,
      required: false,
    },
    totalPaidValue: {
      type: Number,
      required: false,
    },
  },
});

userSchema.plugin(fieldEncryption, {
  secret: encryptionKey,
  fields: ["bitcoinPortfolio", "passwordHash"],
});

const UserEntity = mongoose.model("User", userSchema);

module.exports = UserEntity;
