module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      postPic: DataTypes.STRING,
      likes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      underscored: true,
    }
  );

  Post.associate = (model) => {
    Post.belongsTo(model.User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Post.hasMany(model.Comment, {
      foreignKey: {
        name: "post_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    Post.hasMany(model.Likes, {
      foreignKey: {
        name: "post_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Post;
};
