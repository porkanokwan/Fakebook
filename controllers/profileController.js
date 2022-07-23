exports.profile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
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
