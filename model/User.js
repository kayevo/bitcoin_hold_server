const Portfolio = require("./Portfolio");

class User {
  constructor(_email, _passwordHash) {
    this.email = _email;
    this.passwordHash = _passwordHash;
    this.bitcoinPortfolio = new Portfolio()
  }
}

module.exports = User;
