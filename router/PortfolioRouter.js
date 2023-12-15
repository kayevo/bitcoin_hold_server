const express = require("express");
const PortfolioController = require("../controller/PortfolioController");

const router = express.Router();

router.get("/", PortfolioController.getPortfolio);
router.post("/customize", PortfolioController.setPortfolio);
router.post("/add", PortfolioController.addAmount);
router.post("/remove", PortfolioController.removeAmount);

module.exports = router;
