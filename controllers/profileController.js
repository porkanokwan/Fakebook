const cloudinary = require("../utils/cloudinary");
const { findAcceptedFriend } = require("../service/friendService");
const { User } = require("../models");
const fs = require("fs");
const createError = require("../utils/createError");

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

exports.getProfileById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("user not found on this server", 400);
    }

    const result = JSON.parse(JSON.stringify(user, null, 2));
    // console.log(result);

    const friends = await findAcceptedFriend(user.id);
    // console.log(friends);
    res.json({ user: { ...result, friends } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // console.log(req.file);
    // console.log(cloudinary.upload);
    // console.log(req.files);
    if (!req.files) {
      createError("profilePic or coverPhoto is require", 400);
    }

    let updateValue = {};
    // Upload แยก ถ้าจะ Upload รวมให้ใช้ Promise.all() ซึ่งทุกอันต้องมีค่าส่งออกมา ดังนั้น ต้องเช็คก่อนว่ามีค่าทั้งหมดมั้ย ถ้าไม่มีค่าแค่อันเดียวมันจะ error
    if (req.files.profilePic) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      if (req.user.profilePic) {
        const splited = req.user.profilePic.split("/");
        const public_id = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(public_id);
      }
      updateValue.profilePic = result.secure_url;
      // update ในนี้เลยก็ได้ จะได้ไม่ต้อง update ข้างนอก
      // await User.update({profilePic: result.secure_url}, { where: { id: req.user.id } });
    }

    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      if (req.user.coverPhoto) {
        const splited = req.user.coverPhoto.split("/");
        const public_id = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(public_id);
      }
      updateValue.coverPhoto = result.secure_url;
      // await User.update({coverPhoto: result.secure_url}, { where: { id: req.user.id } });
    }

    await User.update(updateValue, { where: { id: req.user.id } });

    res.status(200).json({ ...updateValue });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }

    if (req.files.coverPhoto) {
      fs.unlinkSync(req.files.coverPhoto[0].path);
    }
  }
};
