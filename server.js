require("dotenv").config();
const express = require("express");
const databaseConnection = require("./data/database");
const { deleteMockUsers } = require("./helper/DatabaseHelper");
const loginRouter = require('./router/LoginRouter');
const portfolioRouter = require('./router/PortfolioRouter')
const adsRouter = require('./router/AdsRouter')
const bitcoinRouter = require('./router/BitcoinRouter')

databaseConnection();

const app = express();

app.use("/user", loginRouter)
app.use("/portfolio", portfolioRouter)
app.use("/ads", adsRouter)
app.use("/bitcoin", bitcoinRouter)

app.listen(8080, () => console.log("Server started"));