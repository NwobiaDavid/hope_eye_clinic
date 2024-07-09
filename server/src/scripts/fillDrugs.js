const sequelize = require('../sequelize');
const Drug = require('../models/drugModel');

const drugs = [
    { name: 'Aspirin', manufacturer: 'Bayer', amount: 100, price: 9.99 },
    { name: 'Ibuprofen', manufacturer: 'Advil', amount: 200, price: 14.99 },
    { name: 'Paracetamol', manufacturer: 'Tylenol', amount: 150, price: 12.99 },
    { name: 'Amoxicillin', manufacturer: 'Pfizer', amount: 50, price: 19.99 },
    { name: 'Ciprofloxacin', manufacturer: 'Bayer', amount: 75, price: 24.99 },
    { name: 'Metformin', manufacturer: 'Merck', amount: 120, price: 29.99 },
    { name: 'Lisinopril', manufacturer: 'Lupin', amount: 100, price: 7.99 },
    { name: 'Amlodipine', manufacturer: 'Pfizer', amount: 80, price: 11.99 },
    { name: 'Simvastatin', manufacturer: 'Merck', amount: 90, price: 16.99 },
    { name: 'Omeprazole', manufacturer: 'AstraZeneca', amount: 110, price: 13.99 }
];

sequelize.sync({ force: false }).then(() => {
    Drug.bulkCreate(drugs)
        .then(() => {
            console.log('Dummy drugs have been inserted.');
        })
        .catch((error) => {
            console.error('Error inserting dummy drugs:', error);
        })
        .finally(() => {
            sequelize.close();
        });
});
