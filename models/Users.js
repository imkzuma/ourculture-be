const sequelize = require("../config/connection");
const { DataTypes, Sequelize, Model } = require("sequelize");

class User extends Model{}

User.init(
  {
    username: DataTypes.STRING,
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    googleToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize, 
    modelName: "users"
  }
);

module.exports = User;