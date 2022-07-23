const express = require("express");
const friendController = require("../controllers/friendController");
const router = express.Router();

router.get("/", friendController.getAllFriend);
router.post("/", friendController.sendRequest);
router.patch("/:request_from_id", friendController.updateStatusFriend);
router.delete("/:friend_id", friendController.deleteFriend);

module.exports = router;
