module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM("accepted", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      underscored: true,
    }
  );
  return Friend;
};
