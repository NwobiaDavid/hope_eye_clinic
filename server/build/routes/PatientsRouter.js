// routes/patientRoute.js
const express = require('express');

const router = express.Router();
const {
    registerPatient,
    getPatientById,
    getDrugsBoughtByPatient,
    getItemsBoughtByPatient,
    getAppointmentsByPatient,
    getConsultationsByPatient,
    getVisitsByPatient,
    getPurchaseHistoryByPatient,
    getAllPatients,
    updatePatient,
    deletePatient,
} = require('../controllers/PatientsController');


// Register a new patient
router.get('/patients',getAllPatients );

// Register a new patient
router.post('/newpatients', registerPatient);

router.put('/patients/:id', updatePatient);

router.delete('/patients/:id', deletePatient);

// Get an existing patient by ID
router.get('/patients/:id', getPatientById);

// Get list of drugs bought by the patient
router.get('/patients/:id/drugs', getDrugsBoughtByPatient);

// Get list of items bought by the patient
router.get('/patients/:id/items', getItemsBoughtByPatient);

// Get list of appointments booked by the patient
router.get('/patients/:id/appointments', getAppointmentsByPatient);

// Get list of consultations booked by the patient
router.get('/patients/:id/consultations', getConsultationsByPatient);

// Get list of visits by the patient
router.get('/patients/:id/visits', getVisitsByPatient);

// Get purchase history of a patient
router.get('/patients/:id/purchase-history', getPurchaseHistoryByPatient);

// return router;
module.exports = router;
