const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

var encKey = process.env.ENC_KEY_32BYTE_BASE64;
var sigKey = process.env.SIG_KEY_64BYTE_BASE64;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true, // index field
  },
  password: {
    type: String,
    required: true,
  },
  bitcoinPortfolio: {
    satoshiAmount: Number, // integer number in satoshis
    bitcoinAveragePrice: Number, // decimal number with 2 decimals precision
  },
});

userSchema.pre('create', function (next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["password"],
});

const UserEntity = mongoose.model("User", userSchema);

module.exports = UserEntity;
