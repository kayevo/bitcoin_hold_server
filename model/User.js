const Credential = require("./Credential");
const BitcoinPortfolio = require("./BitcoinPortfolio");

class User extends Credential {
  constructor(_email, _passwordHash) {
    super(_email, _passwordHash)
    this.bitcoinPortfolio = new BitcoinPortfolio(0, 0)
  }
}

module.exports = User;
