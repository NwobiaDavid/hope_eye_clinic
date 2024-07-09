// models/DrugBought.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');
const Drug = require('./drugModel');

const DrugBought = sequelize.define('DrugBought', {
    drug_name: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    purchase_date: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'drugs_bought',
    timestamps: false,
});

DrugBought.belongsTo(Patient, { foreignKey: 'patient_id' });
DrugBought.belongsTo(Drug, { foreignKey: 'drug_id' });

module.exports = DrugBought;
