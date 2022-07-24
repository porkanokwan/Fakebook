const cloudinary = require("cloudinary").v2;
const { findAcceptedFriend } = require("../service/friendService");
const { User } = require("../models");
const fs = require("fs/promises");

exports.profile = async (req, res, next) => {
  try {
    const friends = await findAcceptedFriend(req.user.id);
    console.log(friends);
    const user = { ...JSON.parse(JSON.stringify(req.user, null, 2)), friends };
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // console.log(req.file);
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (error) {
        return next(error);
      }

      await User.update(
        { profilePic: result.secure_url },
        { where: { id: req.user.id } }
      );

      fs.unlink(req.file.path);

      res.status(200).json({ profilePic: result.secure_url });
    });
  } catch (err) {
    next(err);
  }
};
