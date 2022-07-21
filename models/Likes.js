module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define(
    "Likes",
    {},
    {
      underscored: true,
    }
  );
  return Likes;
};
