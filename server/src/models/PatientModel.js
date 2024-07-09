// models/Patient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Patient = sequelize.define('Patient', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
    },
    regStatus: {
        type: DataTypes.ENUM('Paid', 'Not Paid'),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    note: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'patients',
    timestamps: false,
});

module.exports = Patient;
