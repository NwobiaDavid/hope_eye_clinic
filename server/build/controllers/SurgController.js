const Surgery = require('../models/SurgModel');
const { Op } = require('sequelize');

exports.getAllSurg = async (req, res) => {
    const { patient_id } = req.query;

    try {
        const surgs = await Surgery.findAll({
            where: patient_id ? { patient_id: patient_id } : {},
        });
        res.status(200).json(surgs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Surgeries.' });
    }
};

exports.getSurgById = async (req, res) => {
    const { id } = req.params;

    try {
        const surg = await Surgery.findByPk(id);
        if (surg) {
            res.status(200).json(surg);
        } else {
            res.status(404).json({ error: 'Surgery not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Surgeries.' });
    }
};

exports.createSurg = async (req, res) => {
    const { surgery_date, doctor_name, type, patient_id } = req.body;

    try {
        const newSurg = await Surgery.create({
            surgery_date,
            doctor_name,
            type,
            patient_id,
        });
        res.status(201).json(newSurg);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Surgeries.' });
    }
};

exports.updateSurg = async (req, res) => {
    const { id } = req.params;
    const { surgery_date, doctor_name, type } = req.body;

    try {
        const surg = await Surgery.findByPk(id);
        if (surg) {
            surg.surgery_date = surgery_date;
            surg.doctor_name = doctor_name;
            surg.type = type;
            await surg.save();
            res.status(200).json(surg);
        } else {
            res.status(404).json({ error: 'surgs not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update surgs.' });
    }
};

exports.deleteSurg = async (req, res) => {
    const { id } = req.params;

    try {
        const surg = await Surg.findByPk(id);
        if (surg) {
            await surg.destroy();
            res.status(204).json({ message: 'surg deleted successfully.' });
        } else {
            res.status(404).json({ error: 'surg not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete surg.' });
    }
};
