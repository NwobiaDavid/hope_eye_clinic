const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');

const Surgery = sequelize.define('Surgery', {
    surgery_date: {
        type: DataTypes.DATE,
    },
    doctor_name: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'surgeries',
    timestamps: false,
});

Surgery.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Surgery;
