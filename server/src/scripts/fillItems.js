const sequelize = require('../sequelize');
const Item = require('../models/itemModel');

const items = [
    { name: 'Bandage', manufacturer: 'HealthCo', amount: 100, price: 2.50 },
    { name: 'Gauze', manufacturer: 'MediSupplies', amount: 200, price: 1.25 },
    { name: 'Antiseptic', manufacturer: 'PharmaInc', amount: 150, price: 5.00 },
    { name: 'Syringe', manufacturer: 'NeedleWorks', amount: 300, price: 0.75 },
    { name: 'Thermometer', manufacturer: 'TempTech', amount: 50, price: 10.00 }
];

sequelize.sync({ force: false }).then(() => {
    Item.bulkCreate(items)
        .then(() => {
            console.log('Dummy items have been inserted.');
        })
        .catch((error) => {
            console.error('Error inserting dummy items:', error);
        })
        .finally(() => {
            sequelize.close();
        });
});
