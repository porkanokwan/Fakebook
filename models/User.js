module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 10],
        },
      },
      phoneNumber: DataTypes.STRING,
      profilePic: DataTypes.STRING,
      coverPhoto: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  //   User.associate = (model) => {
  //     User.hasMany(model.Post, {
  //       foreignKey: {
  //         name: "user_id",
  //         allowNull: false,
  //       },
  //       onDelete: "RESTRICT",
  //       onUpdate: "RESTRICT",
  //     });
  //   };

  return User;
};
