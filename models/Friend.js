const { friend_accepted, friend_pending } = require("../config/constant");
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM(friend_accepted, friend_pending),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      underscored: true,
    }
  );

  Friend.associate = (model) => {
    Friend.belongsTo(model.User, {
      as: "requestFrom",
      foreignKey: {
        name: "request_from_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Friend.belongsTo(model.User, {
      as: "requestTo",
      foreignKey: {
        name: "request_to_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Friend;
};
