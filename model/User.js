const BitcoinPortfolio = require("./BitcoinPortfolio");

class User{
  constructor(_email, _passwordHash) {
    this.email = _email;
    this.passwordHash = _passwordHash;
    this.bitcoinPortfolio = new BitcoinPortfolio(0, 0)
  }
}

module.exports = User;
