require("dotenv").config();
const express = require("express");
const databaseConnection = require(".././data/database");
const UserEntity = require(".././entity/UserEntity");
const AdsEntity = require(".././entity/AdsEntity");
const Credential = require(".././model/Credential");
const BitcoinPortfolio = require(".././model/BitcoinPortfolio");
const User = require(".././model/User");
const CurrencyHelper = require(".././helper/CurrencyHelper");
const Ads = require(".././model/Ads");
const { deleteMockUsers } = require(".././helper/DatabaseHelper");
const loginRouter = require(".././router/LoginRouter");

class PortfolioController {
  async getPortfolio(req, res) {
    const userId = req.query.userId;
    const appKey = req.headers.api_key;

    if (userId == undefined || appKey != process.env.APP_KEY) {
      res.status(400).send({}); // bad request
    } else {
      try {
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (!user) {
            res.status(404).send({}); // not found
          } else {
            if (user?.errors) {
              res.status(500).send({});
            } else {
              res.status(200).send(user.bitcoinPortfolio);
            }
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }

  async setPortfolio(req, res) {
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
          { bitcoinPortfolio: newPortfolio }
        ).then((user) => {
          if (!user?.errors && user) {
            res.status(200).send({});
          } else {
            res.status(500).send({});
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }

  async addValue(req, res) {
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
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (user) {
            const newPortfolio = new BitcoinPortfolio(
              user.bitcoinPortfolio.satoshiAmount,
              user.bitcoinPortfolio.bitcoinAveragePrice
            );

            newPortfolio.addFunds(satoshiAmount, bitcoinAveragePrice);
            UserEntity.updateOne(
              { _id: userId },
              { bitcoinPortfolio: newPortfolio }
            ).then((user) => {
              if (!user?.errors && user) {
                res.status(200).send({});
              } else {
                res.status(500).send({});
              }
            });
          } else {
            res.status(500).send({});
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }

  async removeValue(req, res) {
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
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (!user?.errors && user) {
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
                { bitcoinPortfolio: newPortfolio }
              ).then((user) => {
                if (!user?.errors && user) {
                  res.status(200).send({});
                } else {
                  res.status(500).send({});
                }
              });
            }
          } else {
            res.status(500).send({});
          }
        });
      } catch (error) {
        res.status(500).send({});
      }
    }
  }
}

module.exports = new PortfolioController();
