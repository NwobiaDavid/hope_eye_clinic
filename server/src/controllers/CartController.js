const Drug = require('../models/DrugModel');
const Item = require('../models/ItemModel');
const DrugBought = require('../models/DrugBoughtModel');
const ItemBought = require('../models/ItemBoughtModel');

let cart = {
    drugs: [],
    items: []
};

exports.addToCart = (req, res) => {
    const { type, name, quantity, patient_id } = req.body;

    if (type === 'drug') {
        cart.drugs.push({ drug_name: name, quantity, patient_id });
    } else if (type === 'item') {
        cart.items.push({ item_name: name, quantity, patient_id });
    } else {
        return res.status(400).json({ error: 'Invalid type. Must be "drug" or "item".' });
    }

    res.status(200).json({ message: `${type} added to cart.` });
};

exports.fetchItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items.' });
    }
};

exports.fetchDrugs = async (req, res) => {
    try {
        const drugs = await Drug.findAll();
        res.status(200).json(drugs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drugs.' });
    }
};

exports.checkout = async (req, res) => {
    try {
        const drugPromises = cart.drugs.map(drug => 
            DrugBought.create({
                drug_name: drug.drug_name,
                quantity: drug.quantity,
                purchase_date: new Date(),
                patient_id: drug.patient_id
            })
        );

        const itemPromises = cart.items.map(item => 
            ItemBought.create({
                item_name: item.item_name,
                quantity: item.quantity,
                purchase_date: new Date(),
                patient_id: item.patient_id
            })
        );

        await Promise.all([...drugPromises, ...itemPromises]);

        // Clear the cart after successful checkout
        cart.drugs = [];
        cart.items = [];

        res.status(201).json({ message: 'Checkout successful. Purchases recorded.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to checkout. Please try again.' });
    }
};

exports.getPurchases = async (req, res) => {
    const { patient_id } = req.query;

    try {
        const drugsBought = await DrugBought.findAll({ where: { patient_id } });
        const itemsBought = await ItemBought.findAll({ where: { patient_id } });

        res.status(200).json({ drugsBought, itemsBought });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchases.' });
    }
};
