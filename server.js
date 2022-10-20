require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const UserEntity = require("./entity/UserEntity");
const Credential = require("./model/Credential");
const BitcoinPortfolio = require("./model/BitcoinPortfolio");
const User = require("./model/User");
const CurrencyHelper = require("./helper/CurrencyHelper");
const emptyBody = {};

databaseConnection();

const app = express();

app.post("/user", async (req, res) => {
  const user = new User(req.query.email, req.query.password);

  if (user.email == undefined || user.password == undefined) {
    res.status(400).send(emptyBody);
  } else {
    try {
      await UserEntity.create(user);
      res.status(201).send(emptyBody);
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/user", (req, res) => {
  const credential = new Credential(req.query.email, req.query.password);

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne(
        { email: credential.email, password: credential.password },
        function (err, user) {
          if (err) {
            res.status(500).send({ error: err });
          } else {
            if (!user) {
              res.status(404).send(emptyBody); // not found
            } else {
              res.status(200).send({ id: `${user._id}` });
            }
          }
        }
      );
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/user/email", (req, res) => {
  const _email = req.query.email;

  if (_email == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne({ email: _email }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!user) {
            res.status(404).send(emptyBody); // not found
          } else {
            res.status(200).send(emptyBody);
          }
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/portfolio", (req, res) => {
  const _userId = req.query.userId;

  if (_userId == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!user) {
            res.status(404).send(emptyBody); // not found
          } else {
            res.status(200).send(user.bitcoinPortfolio);
          }
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.post("/portfolio/clean", (req, res) => {
  const _userId = req.query.userId;

  UserEntity.updateOne(
    { _id: _userId },
    { bitcoinPortfolio: { satoshiAmount: 0, bitcoinAveragePrice: 0 } },
    function (err, user) {
      if (!err && user) {
        res.status(200).send(emptyBody);
      } else {
        res.status(500).send(emptyBody);
      }
    }
  );
});

app.post("/portfolio/add", (req, res) => {
  const _userId = req.query.userId;
  const _satoshiAmount = parseInt(req.query.satoshiAmount);
  const _bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
    parseFloat(req.query.bitcoinAveragePrice)
  );

  if (
    _userId == undefined ||
    _satoshiAmount == undefined ||
    _bitcoinAveragePrice == undefined
  ) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (!err && user) {
          const newPortfolio = new BitcoinPortfolio(
            user.bitcoinPortfolio.satoshiAmount,
            user.bitcoinPortfolio.bitcoinAveragePrice
          );

          newPortfolio.addFunds(_satoshiAmount, _bitcoinAveragePrice);

          UserEntity.updateOne(
            { _id: _userId },
            { bitcoinPortfolio: newPortfolio },
            function (err, user) {
              if (!err && user) {
                res.status(200).send(emptyBody);
              }
            }
          );
        } else {
          res.status(500).send(emptyBody);
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.post("/portfolio/remove", (req, res) => {
  const _userId = req.query.userId;
  const _satoshiAmount = parseInt(req.query.satoshiAmount);

  if (
    _userId == undefined ||
    _satoshiAmount == undefined 
  ) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (!err && user) {
          if(_satoshiAmount > user.bitcoinPortfolio.satoshiAmount){
            res.status(401).send(emptyBody); // Unauthorized
          }else{
            const newPortfolio = new BitcoinPortfolio(
              user.bitcoinPortfolio.satoshiAmount,
              user.bitcoinPortfolio.bitcoinAveragePrice
            );
            newPortfolio.removeFunds(_satoshiAmount);

            UserEntity.updateOne(
              { _id: _userId },
              { bitcoinPortfolio: newPortfolio },
              function (err, user) {
                if (!err && user) {
                  res.status(200).send(emptyBody);
                }
              }
            );
          }          
        } else {
          res.status(500).send(emptyBody);
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.listen(8080, () => console.log("Server started"));
