const express = require("express");
const AnalysisController = require("../controller/AnalysisController");

const router = express.Router();

router.get("/", AnalysisController.getAnalysis);

module.exports = router;
