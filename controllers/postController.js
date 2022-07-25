const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const { Post, User, Likes, Comment, sequelize } = require("../models");
const fs = require("fs");

exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!(title || req.file)) {
      createError("title or picture is require", 400);
    }
    let postPic;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      postPic = result.secure_url;
    }

    const post = await Post.create({
      title,
      postPic,
      user_id: req.user.id,
    });

    const newPost = await Post.findOne({
      where: { id: post.id },
      attributes: ["user_id"],
      include: { model: User, attributes: { exclude: ["password"] } },
    });
    res.json({ newPost });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { title } = req.body;

    if (!(title || req.file)) {
      createError("title or picture is require", 400);
    }

    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.user_id !== req.user.id) {
      createError("You are have no permission", 403);
    }

    let updatePicture;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);

      if (post.postPic) {
        const splited = post.postPic.split("/");
        const picture = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(picture);
      }

      updatePicture = result.secure_url;
    }

    await Post.update(
      { title, postPic: updatePicture },
      { where: { id: post_id } }
    );

    const updatePost = await Post.findOne({ where: { id: post_id } });
    res.json({ post: updatePost });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.deletePost = async (req, res, next) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { post_id } = req.params;
    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.user_id !== req.user.id) {
      createError("You are have no permission", 403);
    }

    if (post.postPic) {
      const splited = post.postPic.split("/");
      const public_id = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(public_id);
    }

    await Comment.destroy(
      { where: { user_id: req.user.id, post_id } },
      { transaction: t }
    );
    await Likes.destroy(
      { where: { user_id: req.user.id, post_id } },
      { transaction: t }
    );
    await post.destroy({ transaction: t });
    await t.commit();

    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { post_id } = req.params;
    const existLike = await Likes.findOne({
      where: { user_id: req.user.id, post_id },
    });
    if (existLike) {
      createError("you already liked this post", 400);
    }

    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      createError("post not Found", 400);
    }

    // เอาคำสั่งที่มันจะเปลี่ยนแปลงข้อมูลใน DB ใส่ในกล่อง Transaction
    const like = await Likes.create(
      { user_id: req.user.id, post_id },
      { transaction: t }
    );
    await post.increment({ likes: 1 }, { transaction: t });
    await t.commit();

    res.json({ like });
  } catch (err) {
    // ย้อนกลับไปก่อนจะเกิด error
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  const t = await sequelize.transaction(); // START TRANSACTION
  try {
    const { post_id } = req.params;
    const like = await Likes.findOne({
      where: { user_id: req.user.id, post_id },
    });
    if (!like) {
      createError("you never like this post", 400);
    }

    const post = await Post.findOne({ where: { id: post_id } });
    if (!post) {
      createError("post not found", 400);
    }

    await Likes.destroy({ where: { id: like.id } }, { transaction: t });
    await post.decrement({ likes: 1 }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
