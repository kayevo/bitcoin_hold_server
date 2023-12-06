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
        res.status(200).send({ PRICE_BRL: response.data.BRL });
      })
      .catch((error) => {
        res.status(500).send({});
      });
  }
}

module.exports = new BitcoinController();
