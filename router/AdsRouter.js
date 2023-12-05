const express = require("express");
const AdsController = require("../controller/AdsController");

const router = express.Router();

router.get("/", AdsController.getAds);
router.get("/title", AdsController.getAdsByTitle);
router.post("/", AdsController.createAds);
router.delete("/delete", AdsController.deleteAds);

module.exports = router;
