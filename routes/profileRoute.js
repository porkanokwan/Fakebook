const express = require("express");
const profileController = require("../controllers/profileController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/", profileController.profile);
router.patch("/", upload.single("profilePic"), profileController.updateProfile);

module.exports = router;
