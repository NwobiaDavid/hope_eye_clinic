// models/Consultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');

const Consultation = sequelize.define('Consultation', {
    consultation_date: {
        type: DataTypes.DATE,
    },
    doctor_name: {
        type: DataTypes.STRING,
    },
    diagnosis: {
        type: DataTypes.TEXT,
    },
    prescription: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'consultations',
    timestamps: false,
});

Consultation.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Consultation;
