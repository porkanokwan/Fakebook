const createError = require("../utils/createError");
const { Comment, Post, User } = require("../models");

exports.createComment = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { title } = req.body;
    if (!title) {
      createError("title is require", 400);
    }
    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      createError("post not found", 400);
    }

    const comment = await Comment.create({
      title,
      post_id,
      user_id: req.user.id,
    });

    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { title } = req.body;
    if (!title) {
      createError("title is require", 400);
    }

    const comment = await Comment.findOne({ where: { id: comment_id } });
    if (!comment) {
      createError("comment not found", 400);
    }
    if (comment.user_id !== req.user.id) {
      createError("You are have no permission", 403);
    }

    await Comment.update({ title }, { where: { id: comment_id } });
    const comments = await Comment.findOne({
      where: { id: comment_id },
      attributes: { exclude: ["user_id"] },
      include: {
        model: User,
        attributes: {
          exclude: ["password", "email", "phoneNumber", "coverPhoto"],
        },
      },
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { post_id, comment_id } = req.params;
    const comment = await Comment.findOne({
      where: { id: comment_id, post_id },
    });
    if (!comment) {
      createError("comment not found", 400);
    }
    if (comment.user_id !== req.user.id) {
      createError("You are have no permission", 403);
    }

    await comment.destroy();
    // เขียน destroy ได้อีกแบบคือ
    // await comment.destroy()

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
