const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/posts", userController.getAllPosts);

module.exports = router;
