// controllers/patientController.js
const { Patient, Appointment, Consultation, DrugBought, ItemBought, Visit } = require('../models');


// Get all patients
const getAllPatients = async (req, res) => {
    try {
        console.log("entered here.......")
        const patients = await Patient.findAll();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch patients', error });
    }
};

// Register a new patient
const registerPatient = async (req, res) => {
    try {
        const { firstName, lastName, gender, age, phoneNumber, regStatus, address } = req.body;
        const newPatient = await Patient.create({  firstName, lastName, gender, age, phoneNumber, regStatus, address });
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an existing patient by ID
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, gender, age, address, phoneNumber, regStatus } = req.body;
  
    if (!firstName || !lastName || !gender || !age || !address || !phoneNumber || !regStatus) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    console.log("editing--" + firstName);
  
    try {
      const [updated] = await Patient.update(
        { firstName, lastName, gender, age, address, phoneNumber, regStatus },
        { where: { id } }
      );
  
      if (updated === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      const updatedPatient = await Patient.findByPk(id);
      res.status(200).json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error); // Log the error details
      res.status(500).json({ message: "Error updating patient", error: error.message });
    }
};



const deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findByPk(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        await patient.destroy();
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting patient", error: error.message });
    }
}


// Get list of drugs bought by the patient
const getDrugsBoughtByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const drugsBought = await DrugBought.findAll({ where: { patient_id: id } });
        res.status(200).json(drugsBought);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of items bought by the patient
const getItemsBoughtByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const itemsBought = await ItemBought.findAll({ where: { patient_id: id } });
        res.status(200).json(itemsBought);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of appointments booked by the patient
const getAppointmentsByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await Appointment.findAll({ where: { patient_id: id } });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of consultations booked by the patient
const getConsultationsByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const consultations = await Consultation.findAll({ where: { patient_id: id } });
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of visits by the patient
const getVisitsByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const visits = await Visit.findAll({ where: { patient_id: id } });
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get purchase history of a patient
const getPurchaseHistoryByPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const drugsBought = await DrugBought.findAll({ where: { patient_id: id } });
        const itemsBought = await ItemBought.findAll({ where: { patient_id: id } });
        res.status(200).json({ drugsBought, itemsBought });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPatients,
    registerPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    getDrugsBoughtByPatient,
    getItemsBoughtByPatient,
    getAppointmentsByPatient,
    getConsultationsByPatient,
    getVisitsByPatient,
    getPurchaseHistoryByPatient,
};