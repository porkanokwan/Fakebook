const express = require("express");
const profileController = require("../controllers/profileController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/", profileController.profile);
router.patch(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  profileController.updateProfile
);

module.exports = router;
