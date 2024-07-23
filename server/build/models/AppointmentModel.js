// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');

const Appointment = sequelize.define('Appointment', {
    appointment_date: {
        type: DataTypes.DATE,
    },
    doctor_name: {
        type: DataTypes.STRING,
    },
    reason: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'appointments',
    timestamps: false,
});

Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Appointment;
