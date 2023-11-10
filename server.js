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

databaseConnection();

const app = express();

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
  const userId = req.query.userId;
  const appKey = req.headers.api_key;

  if (userId == undefined || appKey != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: userId }, function (err, user) {
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
  const userId = req.query.userId;
  const satoshiAmount = parseInt(req.query.satoshiAmount);
  const bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
    parseFloat(req.query.bitcoinAveragePrice)
  );
  const appKey = req.headers.api_key;

  if (
    userId == undefined ||
    satoshiAmount == undefined ||
    bitcoinAveragePrice == undefined ||
    appKey != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: userId }, function (err, user) {
        if (!err && user) {
          const newPortfolio = new BitcoinPortfolio(
            user.bitcoinPortfolio.satoshiAmount,
            user.bitcoinPortfolio.bitcoinAveragePrice
          );

          newPortfolio.addFunds(satoshiAmount, bitcoinAveragePrice);

          UserEntity.updateOne(
            { _id: userId },
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
  const userId = req.query.userId;
  const satoshiAmount = parseInt(req.query.satoshiAmount);
  const appKey = req.headers.api_key;

  if (
    userId == undefined ||
    satoshiAmount == undefined ||
    appKey != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: userId }, function (err, user) {
        if (!err && user) {
          if (satoshiAmount > user.bitcoinPortfolio.satoshiAmount) {
            res.status(401).send({}); // Unauthorized
          } else {
            const newPortfolio = new BitcoinPortfolio(
              user.bitcoinPortfolio.satoshiAmount,
              user.bitcoinPortfolio.bitcoinAveragePrice
            );
            newPortfolio.removeFunds(satoshiAmount);

            UserEntity.updateOne(
              { _id: userId },
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
  const userId = req.query.userId;
  const satoshiAmount = parseInt(req.query.satoshiAmount);
  const bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
    parseFloat(req.query.bitcoinAveragePrice)
  );
  const appKey = req.headers.api_key;

  if (
    userId == undefined ||
    satoshiAmount == undefined ||
    bitcoinAveragePrice == undefined ||
    appKey != process.env.APP_KEY
  ) {
    res.status(400).send({}); // bad request
  } else {
    try {
      const newPortfolio = new BitcoinPortfolio(
        satoshiAmount,
        bitcoinAveragePrice
      );

      UserEntity.updateOne(
        { _id: userId },
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
  const appKey = req.headers.api_key;

  if (appKey != process.env.APP_KEY) {
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
  const title = req.query.title;
  const appKey = req.headers.api_key;

  if (title == undefined || appKey != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.findOne({ title: title }, function (err, ads) {
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
  const title = req.query.title;
  const posterUrl = req.query.posterUrl;
  const webLink = req.query.webLink;
  const appKey = req.headers.api_key;

  const ads = new Ads(title, posterUrl, webLink);

  if (
    ads.title == undefined ||
    ads.posterUrl == undefined ||
    ads.webLink == undefined ||
    appKey != process.env.APP_KEY
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
  const title = req.query.title;
  const appKey = req.headers.api_key;

  if (title == undefined || appKey != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.deleteOne({ title: title }, function (err, ads) {
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
