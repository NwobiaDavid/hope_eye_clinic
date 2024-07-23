const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Patient = require('./PatientModel');
const Item = require('./itemModel');

const ItemBought = sequelize.define('ItemBought', {
    item_name: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    purchase_date: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'items_bought',
    timestamps: false,
});

// Correct the association definition
ItemBought.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = ItemBought;
