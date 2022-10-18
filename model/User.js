const Credential = require("./Credential");
const BitcoinPortfolio = require("./BitcoinPortfolio");

class User extends Credential {
  constructor(_email, _password) {
    super(_email, _password)
    this.bitcoinPortfolio = new BitcoinPortfolio(0, 0)
  }
}

module.exports = User;
