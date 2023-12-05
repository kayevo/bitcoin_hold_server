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
const { deleteMockUsers } = require("./helper/DatabaseHelper");
const loginRouter = require('./router/LoginRouter');
const portfolioRouter = require('./router/PortfolioRouter')

databaseConnection();

const app = express();

app.use("/user", loginRouter)
app.use("/portfolio", portfolioRouter)

app.get("/ads", (req, res) => {
  const appKey = req.headers.api_key;

  if (appKey != process.env.APP_KEY) {
    res.status(400).send({}); // bad request
  } else {
    try {
      AdsEntity.find().then((ads) => {
        if (ads?.errors) {
          res.status(500).send({ error: ads?.errors });
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
      AdsEntity.findOne({ title: title }).then((ads) => {
        if (!ads) {
          res.status(404).send({}); // not found
        } else {
          if (ads?.errors) {
            res.status(500).send({ error: ads?.errors });
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
      AdsEntity.deleteOne({ title: title }).then((ads) => {
        if (!ads?.errors && ads) {
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
