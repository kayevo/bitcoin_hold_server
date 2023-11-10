const bcrypt = require("bcrypt");

class Credential {
  constructor(_email, _password) {
    this.email = _email;
    this.password = _password;
  }

  getHashFromPassword() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(new Error("Error: generating password."));
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) {
            reject(new Error("Error: generating password."));
          }
          resolve(hash);
        });
      });
    });
  }

  validatePasswordForHash(_passwordHash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        this.password,
        _passwordHash,
        (err, result) => {
          if (err) {
            resolve(false);
          } else if (result) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      );
    });
  }
}

module.exports = Credential;
