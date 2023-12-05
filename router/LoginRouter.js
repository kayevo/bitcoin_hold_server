const express = require("express");
const LoginController = require("../controller/LoginController");

const router = express.Router();

router.post("/", LoginController.createUser);
router.get("/auth", LoginController.getUser);
router.get("/email", LoginController.existsUser)

module.exports = router;
