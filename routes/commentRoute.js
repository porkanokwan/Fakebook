const express = require("express");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.post("/:post_id", commentController.createComment);
router.patch("/:comment_id", commentController.updateComment);
router.delete("/:comment_id/post/:post_id", commentController.deleteComment);

module.exports = router;
