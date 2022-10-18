const Credential = require("./Credential");

class User extends Credential {
  constructor(_email, _password) {
    super(_email, _password)
    this.bitcoinPortfolio = new BitcoinPortfolio(0, 0)
  }
}

class BitcoinPortfolio{
  constructor(_satoshiAmount, _averageBitcoinPrice) {
    this.satoshiAmount = _satoshiAmount;
    this.averageBitcoinPrice = _averageBitcoinPrice;
  }
}

module.exports = User;
