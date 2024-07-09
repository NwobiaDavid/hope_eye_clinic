const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.get('/consultations', consultationController.getConsultations);
router.post('/consultations', consultationController.createConsultation);
router.put('/consultations/:id', consultationController.updateConsultation);
router.delete('/consultations/:id', consultationController.deleteConsultation);

module.exports = router;
