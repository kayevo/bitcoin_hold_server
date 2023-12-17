require("dotenv").config();
const axios = require("axios");
const UserEntity = require(".././entity/UserEntity");
const CurrencyHelper = require(".././helper/CurrencyHelper");

class AnalysisController {
  async getAnalysis(req, res) {
    const userId = req.query.userId;
    const appKey = req.headers.api_key;

    if (userId == null || appKey != process.env.APP_KEY) {
      res.status(400).send({}); // bad request
    } else {
      const endpointUrl = process.env.BITCOIN_INFORMATION_URL + `data/price`;
      const params = {
        fsym: "BTC",
        tsyms: `BRL`,
      };
      const headers = {
        Authorization: process.env.BITCOIN_INFORMATION_KEY,
      };

      axios
        .get(endpointUrl, {
          params: params,
          headers: headers,
        })
        .then((response) => {
          UserEntity.findOne({ _id: userId })
            .then((user) => {
              const amount = user.bitcoinPortfolio.amount;
              const bitcoinPrice = response.data.BRL;
              const amountValue = CurrencyHelper.parseToCurrency(
                CurrencyHelper.parseSatoshiToBitcoin(amount) * bitcoinPrice
              )
              const profits = CurrencyHelper.calculatePercentageProfit(
                user.bitcoinPortfolio.averagePrice,
                bitcoinPrice
              );
              res.status(200).send({
                bitcoinPriceInBrl: bitcoinPrice,
                amountValue,
                profits,
              });
            })
            .catch((error) => {
              res.status(500).send({});
            });
        })
        .catch((error) => {
          res.status(500).send({});
        });
    }
  }
}

module.exports = new AnalysisController();
