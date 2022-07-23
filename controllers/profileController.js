const { findAcceptedFriend } = require("../service/friendService");

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
    const { id, profilePic, coverPhoto } = req.user;
    console.log(id);
    res.status(200).json({ url: { profilePic, coverPhoto } });
  } catch (err) {
    next();
  }
};
