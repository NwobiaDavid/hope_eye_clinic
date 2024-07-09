const express = require('express');
const {
    addToCart,
    checkout,
    getPurchases,
    fetchItems,
    fetchDrugs
} = require('../controllers/cartController');

const router = express.Router();

router.post('/cart', addToCart);
router.get('/items', fetchItems);
router.get('/drugs', fetchDrugs);
router.post('/checkout', checkout);
router.get('/purchases', getPurchases);

module.exports = router;
