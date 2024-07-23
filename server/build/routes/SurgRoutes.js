const express = require('express');
const {
    getAllSurg,
    getSurgById,
    createSurg,
    updateSurg,
    deleteSurg,
} = require('../controllers/SurgController');


const router = express.Router();


router.get('/Surgeries', getAllSurg);
router.get('/Surgery/:id', getSurgById);
router.post('/Surgery', createSurg);
router.put('/Surgery/:id', updateSurg);
router.delete('/Surgery/:id', deleteSurg);

module.exports = router;
