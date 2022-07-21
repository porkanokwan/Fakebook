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

  //   Post.associate = (model) => {
  //     Post.belongsTo(model.User, {
  //       foreignKey: {
  //         name: "user_id",
  //       },
  //       onDelete: "RESTRICT",
  //       onUpdate: "RESTRICT",
  //     });
  //   };

  return Post;
};
