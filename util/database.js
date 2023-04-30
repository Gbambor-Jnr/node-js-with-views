const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Cornelik", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
