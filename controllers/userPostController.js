const { Post, User, Comment, Likes } = require("../models");
const { findFriendId } = require("../service/friendService");
const createError = require("../utils/createError");

exports.getAllPosts = async (req, res, next) => {
  try {
    const friendIds = await findFriendId(req.user.id);
    friendIds.push(req.user.id);
    // console.log(friendIds);

    const posts = await Post.findAll({
      where: { user_id: friendIds },
      attributes: { exclude: ["user_id"] },
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "coverPhoto", "email", "phoneNumber"],
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["createAt", "user_id"],
          },
          include: {
            model: User,
            attributes: {
              exclude: ["password", "coverPhoto", "email", "phoneNumber"],
            },
          },
        },
        {
          model: Likes,
          attributes: ["createdAt"],
          include: {
            model: User,
            attributes: {
              exclude: ["password", "coverPhoto", "email", "phoneNumber"],
            },
          },
        },
      ],
    });
    // console.log(JSON.stringify(post, null, 2));
    if (!posts.length) {
      createError("post not found", 400);
    }

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};
