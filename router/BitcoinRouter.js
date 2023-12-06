const express = require("express");
const BitcoinController = require("../controller/BitcoinController");

const router = express.Router();

router.get("/", BitcoinController.getBitcoinPrice);

module.exports = router;
