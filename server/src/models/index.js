// models/index.js
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');
const Appointment = require('./AppointmentModel');
const Consultation = require('./ConsultationModel');
const DrugBought = require('./DrugBoughtModel');
const ItemBought = require('./ItemBoughtModel');
const Visit = require('./VisitModel');
const Test = require('./TestModel');
const Surgery = require('./SurgModel');

// Establish associations
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Consultation.belongsTo(Patient, { foreignKey: 'patient_id' });
DrugBought.belongsTo(Patient, { foreignKey: 'patient_id' });
ItemBought.belongsTo(Patient, { foreignKey: 'patient_id' });
Visit.belongsTo(Patient, { foreignKey: 'patient_id' });
Test.belongsTo(Patient, { foreignKey: 'patient_id' });
Surgery.belongsTo(Patient, { foreignKey: 'patient_id' });

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});


module.exports = {
    Patient,
    Appointment,
    Consultation,
    DrugBought,
    ItemBought,
    Visit,
    Test,
    Surgery
};
