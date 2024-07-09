const Test = require('../models/TestModel');
const { Op } = require('sequelize');

exports.getAllTest = async (req, res) => {
    const { patient_id } = req.query;

    try {
        const tests = await Test.findAll({
            where: patient_id ? { patient_id: patient_id } : {},
        });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tests.' });
    }
};

exports.getTestById = async (req, res) => {
    const { id } = req.params;

    try {
        const test = await test.findByPk(id);
        if (test) {
            res.status(200).json(test);
        } else {
            res.status(404).json({ error: 'Test not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch test.' });
    }
};

exports.createTest = async (req, res) => {
    const { test_date, doctor_name, type, patient_id } = req.body;

    try {
        const newTest = await Test.create({
            test_date,
            doctor_name,
            type,
            patient_id,
        });
        res.status(201).json(newTest);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create test.' });
    }
};

exports.updateTest = async (req, res) => {
    const { id } = req.params;
    const { test_date, doctor_name, type } = req.body;

    try {
        const test = await Test.findByPk(id);
        if (test) {
            test.test_date = test_date;
            test.doctor_name = doctor_name;
            test.reason = reason;
            await test.save();
            res.status(200).json(test);
        } else {
            res.status(404).json({ error: 'test not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update test.' });
    }
};

exports.deleteTest = async (req, res) => {
    const { id } = req.params;

    try {
        const test = await Test.findByPk(id);
        if (test) {
            await test.destroy();
            res.status(204).json({ message: 'test deleted successfully.' });
        } else {
            res.status(404).json({ error: 'test not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete test.' });
    }
};
