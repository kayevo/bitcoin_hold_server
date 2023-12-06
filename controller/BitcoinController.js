require("dotenv").config();
const axios = require("axios");

class BitcoinController {
  async getBitcoinPrice(req, res) {
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
        res.status(200).send({ priceBrl: response.data.BRL });
      })
      .catch((error) => {
        res.status(500).send({});
      });
  }
}

module.exports = new BitcoinController();
