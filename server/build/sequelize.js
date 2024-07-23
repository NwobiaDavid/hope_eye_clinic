// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hope_clinic', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
