require("dotenv").config();
const UserEntity = require(".././entity/UserEntity");
const BitcoinPortfolio = require(".././model/BitcoinPortfolio");
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
    const _bitcoinAveragePrice = req.query.bitcoinAveragePrice;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      _amount == null ||
      _bitcoinAveragePrice == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        const amount = parseInt(_amount);
        const bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
          parseFloat(_bitcoinAveragePrice)
        );
        const newPortfolio = new BitcoinPortfolio(amount, bitcoinAveragePrice);

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
            const newPortfolio = new BitcoinPortfolio(
              user.bitcoinPortfolio.satoshiAmount,
              user.bitcoinPortfolio.bitcoinAveragePrice,
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
    const _receivedValue = req.query.receivedValue;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      _amount == null ||
      _receivedValue == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        const amount = parseInt(_amount);
        const receivedValue = CurrencyHelper.parseToCurrency(
          parseFloat(_receivedValue)
        );
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (!user?.errors && user) {
            if (amount > user.bitcoinPortfolio.satoshiAmount) {
              res.status(401).send({}); // Unauthorized
            } else {
              const newPortfolio = new BitcoinPortfolio(
                user.bitcoinPortfolio.satoshiAmount,
                user.bitcoinPortfolio.bitcoinAveragePrice,
                user.bitcoinPortfolio.totalPaidValue
              );
              newPortfolio.removeAmount(amount, receivedValue);

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
