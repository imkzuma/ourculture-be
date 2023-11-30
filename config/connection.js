const { Sequelize } = require("sequelize");
const dbConfig = require("./config.json")['development'];

const sequelize = new Sequelize({
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;