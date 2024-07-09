const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');

const Test = sequelize.define('Test', {
    test_date: {
        type: DataTypes.DATE,
    },
    doctor_name: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'tests',
    timestamps: false,
});

Test.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Test;
