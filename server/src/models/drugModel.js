// models/Drug.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Drug = sequelize.define('Drug', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
}, {
    tableName: 'drug',
    timestamps: false,
});

module.exports = Drug;
