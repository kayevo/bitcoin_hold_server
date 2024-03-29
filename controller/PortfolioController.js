require("dotenv").config();
const UserEntity = require(".././entity/UserEntity");
const Portfolio = require("../model/Portfolio");
const CurrencyHelper = require(".././helper/CurrencyHelper");

class PortfolioController {
  async getPortfolio(req, res) {
    const userId = req.query.userId;
    const appKey = req.headers.api_key;

    if (userId == null || appKey != process.env.APP_KEY) {
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
    const _amount = req.query.satoshiAmount ?? req.query.amount; // amount in satoshis
    const _totalPaidValue = req.query.totalPaidValue;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      _amount == null ||
      _totalPaidValue == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        const totalPaidValue = CurrencyHelper.parseToCurrency(
          parseFloat(_totalPaidValue)
        );
        const amount = parseInt(_amount);
        const newPortfolio = new Portfolio();
        newPortfolio.addAmount(amount, totalPaidValue);

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

  async addAmount(req, res) {
    const userId = req.query.userId;
    var _amount = req.query.satoshiAmount ?? req.query.amount; // amount in satoshis
    var _paidValue = req.query.bitcoinAveragePrice ?? req.query.paidValue;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      _amount == null ||
      _paidValue == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        const amount = parseInt(_amount);
        const paidValue = CurrencyHelper.parseToCurrency(
          parseFloat(_paidValue)
        );
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (user) {
            const newPortfolio = new Portfolio(
              user.bitcoinPortfolio.amount,
              user.bitcoinPortfolio.averagePrice,
              user.bitcoinPortfolio.totalPaidValue
            );
            newPortfolio.addAmount(amount, paidValue);

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

  async removeAmount(req, res) {
    const userId = req.query.userId;
    const _amount = req.query.satoshiAmount ?? req.query.amount; // amount in satoshis
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      _amount == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        const amount = parseInt(_amount);
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (!user?.errors && user) {
            if (amount > user.bitcoinPortfolio.amount) {
              res.status(401).send({}); // Unauthorized
            } else {
              const newPortfolio = new Portfolio(
                user.bitcoinPortfolio.amount,
                user.bitcoinPortfolio.averagePrice,
                user.bitcoinPortfolio.totalPaidValue
              );
              newPortfolio.removeAmount(amount);

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
