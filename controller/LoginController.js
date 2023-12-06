require("dotenv").config();
const UserEntity = require(".././entity/UserEntity");
const Credential = require(".././model/Credential");
const User = require(".././model/User");

class LoginController {
  async createUser(req, res) {
    const credential = new Credential(req.query.email, req.query.password);
    const appKey = req.headers.api_key;

    if (
      credential.email == undefined ||
      credential.password == undefined ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({});
    } else {
      try {
        UserEntity.findOne({ email: credential.email }).then((user) => {
          if (user) {
            res.status(409).send({}); // user already exists
          } else {
            credential
              .getHashFromPassword()
              .then((hash) => {
                return UserEntity.create(new User(credential.email, hash));
              })
              .then((createdUser) => {
                res.status(201).send({});
              })
              .catch((error) => {
                res.status(500).send({});
              });
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }

  async getUser(req, res) {
    const credential = new Credential(req.query.email, req.query.password);
    const appKey = req.headers.api_key;

    if (
      credential.email == undefined ||
      credential.password == undefined ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        UserEntity.findOne({ email: credential.email }).then((user) => {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            if (user?.errors) {
              res.status(500).send({});
            } else {
              credential
                .validatePasswordForHash(user.passwordHash)
                .then((isPasswordValidForHash) => {
                  if (isPasswordValidForHash) {
                    res.status(200).send({ id: `${user._id}` }); // Passwords match
                  } else {
                    res.status(404).send({});
                  }
                })
                .catch((error) => {
                  res.status(500).send({});
                });
            }
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }

  // TODO deprecated method, should be removed, create user method already verify if user exists
  async existsUser(req, res) {
    const email = req.query.email;
    const appKey = req.headers.api_key;

    if (email == undefined || appKey != process.env.APP_KEY) {
      res.status(400).send({}); // bad request
    } else {
      try {
        UserEntity.findOne({ email: email }).then((user) => {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            if (user?.errors) {
              res.status(500).send({});
            } else {
              res.status(200).send({});
            }
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }
}

module.exports = new LoginController();
