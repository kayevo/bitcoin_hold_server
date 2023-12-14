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
    const amount = req.query.satoshiAmount ?? req.query.amount;
    const bitcoinAveragePrice = req.query.bitcoinAveragePrice;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      amount == null ||
      bitcoinAveragePrice == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        amount = parseInt(amount);
        bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
          parseFloat(bitcoinAveragePrice)
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

  async addFunds(req, res) {
    const userId = req.query.userId;
    var amount = req.query.satoshiAmount ?? req.query.amount; // amount in satoshis
    var paidPrice = req.query.bitcoinAveragePrice ?? req.query.paidPrice;
    const appKey = req.headers.api_key;

    if (
      userId == null ||
      amount == null ||
      paidPrice == null ||
      appKey != process.env.APP_KEY
    ) {
      res.status(400).send({}); // bad request
    } else {
      try {
        amount = parseInt(amount);
        paidPrice = CurrencyHelper.parseToCurrency(parseFloat(paidPrice));
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (user) {
            const newPortfolio = new BitcoinPortfolio(
              user.bitcoinPortfolio.satoshiAmount,
              user.bitcoinPortfolio.bitcoinAveragePrice
            );

            newPortfolio.addFunds(amount, paidPrice);
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

  async removeFunds(req, res) {
    const userId = req.query.userId;
    const amount = req.query.satoshiAmount ?? req.query.amount;
    const appKey = req.headers.api_key;

    if (userId == null || amount == null || appKey != process.env.APP_KEY) {
      res.status(400).send({}); // bad request
    } else {
      try {
        amount = parseInt(amount);
        UserEntity.findOne({ _id: userId }).then((user) => {
          if (!user?.errors && user) {
            if (amount > user.bitcoinPortfolio.satoshiAmount) {
              res.status(401).send({}); // Unauthorized
            } else {
              const newPortfolio = new BitcoinPortfolio(
                user.bitcoinPortfolio.satoshiAmount,
                user.bitcoinPortfolio.bitcoinAveragePrice
              );
              newPortfolio.removeFunds(amount);

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
