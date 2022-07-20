const express = require("express");
const friendController = require("../controllers/friendController");
const router = express.Router();

router.get("/", friendController.getFriendRequest);
router.post("/", friendController.sendRequest);
router.patch("/:friend_id", friendController.updateStatusFriend);
router.delete("/:friend_id", friendController.deleteFriend);

module.exports = router;
