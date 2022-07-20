const express = require("express");
const profileController = require("../controllers/profileController");
const router = express.Router();

router.get("/", profileController.profile);
router.patch("/", profileController.updateProfile);

module.exports = router;
