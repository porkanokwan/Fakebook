const createError = require("../utils/createError");
const { Friend, User } = require("../models");
const { Op } = require("sequelize");
const { friend_accepted, friend_pending } = require("../config/constant");
const {
  findAcceptedFriend,
  findPendingFriend,
  unknownFriend,
  requestToFriend,
} = require("../service/friendService");

exports.getAllFriend = async (req, res, next) => {
  try {
    const { status } = req.query;
    let users = [];
    if (status?.toLowerCase() === "unknown") {
      //**** Find unknown frined
      users = await unknownFriend(req.user.id);
    } else if (status?.toLowerCase() === friend_pending) {
      //**** Find pending frined (เพื่อนที่ขอมาหาเรา)
      users = await findPendingFriend(req.user.id);
    } else if (status?.toLowerCase() === "request") {
      //**** Find request to friend (เพื่อนที่เราขอไป)
      users = await requestToFriend(req.user.id);
    } else {
      //**** Find accepted friend (default)
      users = await findAcceptedFriend(req.user.id);
    }

    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

exports.sendRequest = async (req, res, next) => {
  try {
    const { request_to_id } = req.body;

    if (request_to_id === req.user.id) {
      createError("Cannot request yourself", 400);
    }

    // e.g. request_from_id == friend AND request_to_id == me OR
    // request_from_id == me AND request_to_id == friend
    const existFriend = await Friend.findOne({
      where: {
        [Op.or]: [
          { request_from_id: req.user.id, request_to_id },
          { request_from_id: request_to_id, request_to_id: req.user.id },
        ],
      },
    });

    if (existFriend) {
      createError("This user has already been requested", 400);
    }

    const friend = await Friend.create({
      request_to_id,
      request_from_id: req.user.id,
      status: friend_pending,
    });
    res.json(friend);
  } catch (err) {
    next(err);
  }
};

exports.updateStatusFriend = async (req, res, next) => {
  try {
    const { request_from_id } = req.params;
    const friend = await Friend.findOne({
      where: {
        request_from_id: request_from_id,
        request_to_id: req.user.id,
        status: friend_pending,
      },
    });
    if (!friend) {
      createError("friend request not found", 400);
    }

    await Friend.update(
      { status: friend_accepted },
      { where: { id: friend.id } }
    );
    res.json({ message: "accept request" });
  } catch (err) {
    next(err);
  }
};

exports.deleteFriend = async (req, res, next) => {
  try {
    const { friend_id } = req.params;
    const friend = await Friend.findOne({
      where: {
        id: friend_id,
      },
    });

    if (!friend) {
      createError("friend request not found", 400);
    }

    if (
      friend.request_from_id !== req.user.id ||
      friend.request_to_id !== req.user.id
    ) {
      createError("You have no permission", 403);
    }
    await Friend.destroy({ where: { id: friend.id } });
    res.status(204).json();
  } catch (err) {}
};
