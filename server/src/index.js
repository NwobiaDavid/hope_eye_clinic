const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PatientsRouter  = require('./routes/PatientsRouter');
const ConsultationsRouter  = require('./routes/ConsultationRoutes');
const AppointmentRouter  = require('./routes/AppointmentRoutes');
const TestRouter  = require('./routes/TestRoutes');
const SurgRouter  = require('./routes/SurgRoutes');
const CartRouter  = require('./routes/Cart');

const app = express();
const port = 3000;

app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // default user for XAMPP
    password: '', // default password for XAMPP
    database: 'hope_clinic'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware to parse JSON
app.use(express.json());


// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// app.use('/api/patients', PatientsRouter);
app.use('/api', PatientsRouter, ConsultationsRouter,SurgRouter, AppointmentRouter, TestRouter, CartRouter); 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}...`);
});
