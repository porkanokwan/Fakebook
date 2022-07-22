module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          // len: {
          //   args: [4, 100],
          //   msg: "Length must be greater than 4",
          // },
          min(value) {
            if (value.length < 4) {
              throw new Error("Length must be greater than 4");
            }
          },
        },
      },
      phoneNumber: { type: DataTypes.STRING, unique: true },
      profilePic: DataTypes.STRING,
      coverPhoto: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );

  User.associate = (model) => {
    User.hasMany(model.Post, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    User.hasMany(model.Comment, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    User.hasMany(model.Likes, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    User.hasMany(model.Friend, {
      as: "requestFrom",
      foreignKey: {
        name: "request_from_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });

    User.hasMany(model.Friend, {
      as: "requestTo",
      foreignKey: {
        name: "request_to_id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return User;
};
