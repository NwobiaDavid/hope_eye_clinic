const Appointment = require('../models/AppointmentModel');
const { Op } = require('sequelize');

exports.getAllAppointments = async (req, res) => {
    const { patient_id } = req.query;

    try {
        const appointments = await Appointment.findAll({
            where: patient_id ? { patient_id: patient_id } : {},
        });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
};

exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findByPk(id);
        if (appointment) {
            res.status(200).json(appointment);
        } else {
            res.status(404).json({ error: 'Appointment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointment.' });
    }
};

exports.createAppointment = async (req, res) => {
    const { appointment_date, doctor_name, reason, patient_id } = req.body;

    try {
        const newAppointment = await Appointment.create({
            appointment_date,
            doctor_name,
            reason,
            patient_id,
        });
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment.' });
    }
};

exports.updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointment_date, doctor_name, reason } = req.body;

    try {
        const appointment = await Appointment.findByPk(id);
        if (appointment) {
            appointment.appointment_date = appointment_date;
            appointment.doctor_name = doctor_name;
            appointment.reason = reason;
            await appointment.save();
            res.status(200).json(appointment);
        } else {
            res.status(404).json({ error: 'Appointment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment.' });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findByPk(id);
        if (appointment) {
            await appointment.destroy();
            res.status(204).json({ message: 'Appointment deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Appointment not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment.' });
    }
};
