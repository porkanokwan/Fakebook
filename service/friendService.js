const { Friend, User } = require("../models");
const { Op } = require("sequelize");
const { friend_accepted, friend_pending } = require("../config/constant");

exports.findAcceptedFriend = async (id) => {
  // search every friend of tihs user
  const friend = await Friend.findAll({
    where: {
      status: friend_accepted,
      [Op.or]: [{ request_from_id: id }, { request_to_id: id }],
    },
  });
  // console.log(JSON.stringify(friend, null, 2));

  const friendIds = friend.map((el) => {
    return el.request_to_id === id ? el.request_from_id : el.request_to_id;
  });

  console.log(friendIds);
  // SELECT * from users WHERE id IN (3, 4) IN จะแปลงค่าใน [] ออกมา
  const users = await User.findAll({
    where: { id: friendIds },
    attributes: { exclude: ["password"] },
  });
  return users;
};

exports.findPendingFriend = async (id) => {
  const friend = await Friend.findAll({
    where: {
      status: friend_pending,
      request_to_id: id,
    },
    include: {
      model: User,
      as: "requestFrom",
      attributes: { exclude: ["password"] },
    },
  });
  //   console.log(JSON.stringify(friend, null, 2));
  //   console.log(JSON.stringify(friend.requestFrom, null, 2));

  return friend.map((el) => el.requestFrom);
};

exports.unknownFriend = async (id) => {
  const friend = await Friend.findAll({
    where: {
      status: friend_accepted,
      [Op.or]: [{ request_from_id: id }, { request_to_id: id }],
    },
  });
  const friendIds = friend.map((el) => {
    return el.request_from_id === id ? el.request_to_id : el.request_from_id;
  });
  console.log(JSON.stringify(friend, null, 2));

  friendIds.push(id);

  const friendRequest = await Friend.findAll({
    where: {
      status: friend_pending,
      [Op.or]: [{ request_from_id: id }, { request_to_id: id }],
    },
  });

  const friendRequestIds = friendRequest.map((el) => {
    return el.request_from_id === id ? el.request_to_id : el.request_from_id;
  });

  const allIds = friendIds.concat(friendRequestIds);

  const users = await User.findAll({
    // ไม่เอา id ตัวเอง และอันที่เป็นเพื่อนกับเรา
    where: { id: { [Op.notIn]: allIds } },
    attributes: { exclude: ["password"] },
  });

  return users;
};

exports.requestToFriend = async (id) => {
  const friend = await Friend.findAll({
    where: {
      status: friend_pending,
      request_from_id: id,
    },
    include: {
      model: User,
      as: "requestTo",
      attributes: { exclude: ["password"] },
    },
  });
  //   console.log(JSON.stringify(friend, null, 2));
  //   console.log(JSON.stringify(friend.requestFrom, null, 2));

  return friend.map((el) => el.requestTo);
};

exports.findFriendId = async (id) => {
  const friends = await Friend.findAll({
    where: {
      status: friend_accepted,
      [Op.or]: [{ request_from_id: id }, { request_to_id: id }],
    },
  });

  const friendIds = friends.map((el) =>
    el.request_to_id === id ? el.request_from_id : el.request_to_id
  );
  return friendIds;
};
