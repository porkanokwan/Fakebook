const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/", postController.createPost);
router.patch("/:post_id", postController.updatePost);
router.delete("/:post_id", postController.deletePost);
router.post("/:post_id/like", postController.createLike);
router.delete("/:post_id/like", postController.deleteLike);

module.exports = router;
