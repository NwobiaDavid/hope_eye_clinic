// models/Visit.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');

const Visit = sequelize.define('Visit', {
    visit_date: {
        type: DataTypes.DATE,
    },
    visit_reason: {
        type: DataTypes.TEXT,
    },
    doctor_name: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'visits',
    timestamps: false,
});

Visit.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Visit;
