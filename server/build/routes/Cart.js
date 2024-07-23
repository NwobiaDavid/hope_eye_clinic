const express = require('express');
const {
    addToCart,
    checkout,
    getPurchases,
    fetchItems,
    fetchDrugs,
    createDrug,
    updateDrug,
    deleteDrug,
    updateItem,
    deleteItem,
    createItem
} = require('../controllers/cartController');

const router = express.Router();

router.post('/cart', addToCart);

router.get('/items', fetchItems);
router.post('/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

router.get('/drugs', fetchDrugs);
router.post('/drugs', createDrug);
router.put('/drugs/:id', updateDrug);
router.delete('/drugs/:id', deleteDrug);

router.post('/checkout', checkout);
router.get('/purchases', getPurchases);

module.exports = router;
