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

app.get("/user/auth", (req, res) => {
  const credential = new Credential(req.query.email, req.query.password);
  console.log(req.headers.api_key)

  if (credential.email == undefined || credential.password == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne(
        { email: credential.email},
        function (err, user) {
          if (err) {
            res.status(500).send({ error: err });
          } else {
            if (!user) {
              res.status(404).send(emptyBody); // not found
            } else {
              if(user.password == credential.password){
                res.status(200).send({ id: `${user._id}` });
              }else{
                res.status(404).send(emptyBody); // not found
              }
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

  if (_userId == undefined || _satoshiAmount == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      UserEntity.findOne({ _id: _userId }, function (err, user) {
        if (!err && user) {
          if (_satoshiAmount > user.bitcoinPortfolio.satoshiAmount) {
            res.status(401).send(emptyBody); // Unauthorized
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

app.post("/portfolio/customize", (req, res) => {
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
      const newPortfolio = new BitcoinPortfolio(
        _satoshiAmount,
        _bitcoinAveragePrice
      );

      UserEntity.updateOne(
        { _id: _userId },
        { bitcoinPortfolio: newPortfolio },
        function (err, user) {
          if (!err && user) {
            res.status(200).send(emptyBody);
          } else {
            res.status(500).send(emptyBody);
          }
        }
      );
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.get("/ads", (req, res) => {
  try {
    AdsEntity.find(function (err, ads) {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.status(200).send(ads);
      }
    });
  } catch (error) {
    res.status(500).send(emptyBody);
  }
});

app.get("/ads/title", (req, res) => {
  const _title = req.query.title;

  if (_title == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      AdsEntity.findOne({ title: _title }, function (err, ads) {
        if (err) {
          res.status(500).send({ error: err });
        } else {
          if (!ads) {
            res.status(404).send(emptyBody); // not found
          } else {
            res.status(200).send(ads);
          }
        }
      });
    } catch (error) {
      res.status(500).send(emptyBody);
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
    ads.webLink == undefined
  ) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      await AdsEntity.create(ads);
      res.status(201).send(emptyBody); // created
    } catch (error) {
      res.status(500).send(emptyBody);
    }
  }
});

app.delete("/ads/remove", (req, res) => {
  const _title = req.query.title;

  if (_title == undefined) {
    res.status(400).send(emptyBody); // bad request
  } else {
    try {
      AdsEntity.deleteOne({ title: _title }, function (err, ads) {
        if (!err && ads) {
          res.status(200).send(emptyBody);
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
