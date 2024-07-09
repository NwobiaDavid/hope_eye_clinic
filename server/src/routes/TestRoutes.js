const express = require('express');
const {
    getAllTest,
    getTestById,
    createTest,
    updateTest,
    deleteTest,
} = require('../controllers/testController');

const router = express.Router();


router.get('/tests', getAllTest);
router.get('/tests/:id', getTestById);
router.post('/tests', createTest);
router.put('/tests/:id', updateTest);
router.delete('/tests/:id', deleteTest);

module.exports = router;
