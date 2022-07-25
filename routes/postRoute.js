const express = require("express");
const postController = require("../controllers/postController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/", upload.single("post_pic"), postController.createPost);
router.patch("/:post_id", upload.single("picture"), postController.updatePost);
router.delete("/:post_id", postController.deletePost);

router.post("/:post_id/like", postController.createLike);
router.delete("/:post_id/like", postController.deleteLike);

module.exports = router;
