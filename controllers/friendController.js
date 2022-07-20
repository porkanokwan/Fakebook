exports.getFriendRequest = async (req, res, next) => {
  return res.send("friend request");
};
exports.sendRequest = async (req, res, next) => {
  return res.send("send request success");
};
exports.updateStatusFriend = async (req, res, next) => {
  return res.send("accept request");
};
exports.deleteFriend = async (req, res, next) => {
  return res.send("reject request");
};
