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
router.post('/items', fetchItems);
router.post('/drugs', fetchDrugs);
router.post('/checkout', checkout);
router.get('/purchases', getPurchases);

module.exports = router;
