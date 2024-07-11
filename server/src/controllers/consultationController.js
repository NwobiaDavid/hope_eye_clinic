const Consultation = require('../models/ConsultationModel');

// Get all consultations for a specific patient
exports.getConsultations = async (req, res) => {
    const { patient_id } = req.query;
    try {
        const consultations = await Consultation.findAll({ where:  patient_id ? { patient_id: patient_id  } : {} });
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching consultations', error });
    }
};


exports.getConsultationById = async (req, res) => {
    const { id } = req.params;

    try {
        const consultation = await Consultation.findByPk(id);
        if (consultation) {
            res.status(200).json(consultation);
        } else {
            res.status(404).json({ error: 'consultation not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch consultation.' });
    }
};


// Create a new consultation
exports.createConsultation = async (req, res) => {
    try {
        const { consultation_date, doctor_name, diagnosis, prescription, patient_id } = req.body;
        const newConsultation = await Consultation.create({
            consultation_date,
            doctor_name,
            diagnosis,
            prescription,
            patient_id,
        });
        res.status(201).json(newConsultation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating consultation', error });
    }
};

// Update a consultation
exports.updateConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const { consultation_date, doctor_name, diagnosis, prescription } = req.body;
        const consultation = await Consultation.findByPk(id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        consultation.consultation_date = consultation_date;
        consultation.doctor_name = doctor_name;
        consultation.diagnosis = diagnosis;
        consultation.prescription = prescription;

        await consultation.save();
        res.json(consultation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating consultation', error });
    }
};

// Delete a consultation
exports.deleteConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await Consultation.findByPk(id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        await consultation.destroy();
        res.status(204).json({ message: 'Consultation deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting consultation', error });
    }
};
