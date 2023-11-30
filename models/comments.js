const sequelize = require("../config/connection");
const { DataTypes } = require("sequelize");
const User = require("./Users");
const Barang = require("./barangs");

const Comment = sequelize.define("comments", {
  comment: DataTypes.TEXT,
  rating: DataTypes.FLOAT,
  image: DataTypes.JSON,
  userId: DataTypes.INTEGER,
  barangId: DataTypes.INTEGER,
});

Comment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comment, { foreignKey: "userId" });

Comment.belongsTo(Barang, { foreignKey: "barangId" });
Barang.hasMany(Comment, { foreignKey: "barangId" });

module.exports = Comment;