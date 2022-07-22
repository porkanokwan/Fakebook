module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define(
    "Likes",
    {},
    {
      underscored: true,
    }
  );

  Likes.associate = (model) => {
    Likes.belongsTo(model.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Likes.belongsTo(model.Post, {
      foreignKey: {
        name: "post_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Likes;
};
