require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const UserEntity = require("./entity/UserEntity");
const AdsEntity = require("./entity/AdsEntity");
const Credential = require("./model/Credential");
const BitcoinPortfolio = require("./model/BitcoinPortfolio");
const User = require("./model/User");
const CurrencyHelper = require("./helper/CurrencyHelper");
const Ads = require("./model/Ads");
const bcrypt = require("bcrypt");

databaseConnection();

const app = express();

const getHashFromPassword = (_password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(new Error("Error: generating password."));
      }

      bcrypt.hash(_password, salt, (err, hash) => {
        if (err) {
          reject(new Error("Error: generating password."));
        }
        resolve(hash);
      });
    });
  });
};

app.post("/user", async (req, res) => {
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
      getHashFromPassword(credential.password)
        .then((hash) => {
          return UserEntity.create(new User(credential.email, hash));
        })
        .then((createdUser) => {
          res.status(201).send({});
        })
        .catch((error) => {
          res.status(500).send({});
        });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.get("/user/auth", (req, res) => {
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
      UserEntity.findOne({ email: credential.email }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            bcrypt.compare(credential.password, user.passwordHash, (err, result) => {
              if (err) {
                res.status(404).send({}); // Password comparison failed
              } else if (result) {
                res.status(200).send({ id: `${user._id}` }); // Passwords match
              } else {
                res.status(404).send({}); // Passwords don't match
              }
            });
          }
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.get("/user/email", (req, res) => {
  const email = req.query.email;
  const appKey = req.headers.api_key;

  if (email == undefined || appKey != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ email: email }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            res.status(200).send({});
          }
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.get("/portfolio", (req, res) => {
  const _userId = req.query.userId;

  if (_userId == undefined || req.headers.api_key != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            res.status(200).send(user.bitcoinPortfolio);
          }
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
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
    _bitcoinAveragePrice == undefined ||
    req.headers.api_key != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
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
                res.status(200).send({});
              }
            }
          );
        } else {
          res.status(500).send({});
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.post("/portfolio/remove", (req, res) => {
  const _userId = req.query.userId;
  const _satoshiAmount = parseInt(req.query.satoshiAmount);

  if (
    _userId == undefined ||
    _satoshiAmount == undefined ||
    req.headers.api_key != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (!err && user) {
          if (_satoshiAmount > user.bitcoinPortfolio.satoshiAmount) {
            res.status(401).send({}); // Unauthorized
          } else {
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
                  res.status(200).send({});
                }
              }
            );
          }
        } else {
          res.status(500).send({});
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.post("/portfolio/customize", (req, res) => {
  const _userId = req.query.userId;
  const _satoshiAmount = parseInt(req.query.satoshiAmount);
  const _bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
    parseFloat(req.query.bitcoinAveragePrice)
  );

  if (
    _userId == undefined ||
    _satoshiAmount == undefined ||
    _bitcoinAveragePrice == undefined ||
    req.headers.api_key != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      const newPortfolio = new BitcoinPortfolio(
        _satoshiAmount,
        _bitcoinAveragePrice
      );

      UserEntity.updateOne(
        { _id: _userId },
        { bitcoinPortfolio: newPortfolio },
        function (err, user) {
          if (!err && user) {
            res.status(200).send({});
          } else {
            res.status(500).send({});
          }
        }
      );
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.get("/ads", (req, res) => {
  if (req.headers.api_key != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.find(function (err, ads) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          res.status(200).send(ads);
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.get("/ads/title", (req, res) => {
  const _title = req.query.title;

  if (_title == undefined || req.headers.api_key != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.findOne({ title: _title }, function (err, ads) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!ads) {
            res.status(404).send({}); // not found
          } else {
            res.status(200).send(ads);
          }
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.post("/ads", async (req, res) => {
  const _title = req.query.title;
  const _posterUrl = req.query.posterUrl;
  const _webLink = req.query.webLink;

  const ads = new Ads(_title, _posterUrl, _webLink);

  if (
    ads.title == undefined ||
    ads.posterUrl == undefined ||
    ads.webLink == undefined ||
    req.headers.api_key != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      await AdsEntity.create(ads);
      res.status(201).send({}); // created
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.delete("/ads/remove", (req, res) => {
  const _title = req.query.title;

  if (_title == undefined || req.headers.api_key != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.deleteOne({ title: _title }, function (err, ads) {
        if (!err && ads) {
          res.status(200).send({});
        } else {
          res.status(500).send({});
        }
      });
    } catch (error) {
      res.status(500).send({});
    }
  }
});

app.listen(8080, () => console.log("Server started"));
