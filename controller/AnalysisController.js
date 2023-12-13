require("dotenv").config();
const axios = require("axios");
const UserEntity = require(".././entity/UserEntity");
const CurrencyHelper = require(".././helper/CurrencyHelper");

class AnalysisController {
  async getAnalysis(req, res) {
    const userId = req.query.userId;
    const appKey = req.headers.api_key;

    if (userId == undefined || appKey != process.env.APP_KEY) {
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
              const satoshisAmount = user.bitcoinPortfolio.satoshiAmount;
              const bitcoinPrice = response.data.BRL;
              const portfolioValue =
                CurrencyHelper.parseSatoshiToBitcoin(satoshisAmount) *
                bitcoinPrice;
              const profits = CurrencyHelper.calculatePercentageProfit(
                user.bitcoinPortfolio.bitcoinAveragePrice,
                portfolioValue
              );
              res.status(200).send({
                bitcoinPriceInBrl: response.data.BRL,
                portfolioValue,
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
