module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );

  Comment.associate = (model) => {
    Comment.belongsTo(model.User, {
      foreignKey: {
        name: "user_id",
        allowNull: true,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Comment.belongsTo(model.Post, {
      foreignKey: {
        name: "post_id",
        allowNull: true,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };
  return Comment;
};
