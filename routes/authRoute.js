const express = require("express");
const authUser = require("../controllers/authController");
const router = express.Router();

router.post("/register", authUser.register);
router.post("/login", authUser.login);

module.exports = router;
