const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./Users");

const Barang = sequelize.define("barang", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  userId: DataTypes.INTEGER,
  image: DataTypes.JSON,
  harga: DataTypes.INTEGER,
  location: DataTypes.STRING,
});

Barang.belongsTo(User, { foreignKey: "userId" });
Barang.hasMany(User, { foreignKey: "userId" });

module.exports = Barang;
