const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS package

const app = express();
const port = 5000;

// Middleware to enable CORS
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'db-mysql-nyc3-97524-do-user-17057538-0.c.db.ondigitalocean.com',
  user: 'doadmin',
  password: 'AVNS_sYcDpRswUGHAnYdePSh',
  database: 'horario',
  port: 25060 // Default MySQL port for DigitalOcean
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

// Endpoint to fetch courses
app.get('/courses', (req, res) => {
  const sql = 'SELECT * FROM clases';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    console.log('Data retrieved from database:', result);
    res.json(result);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on https://squid-app-57j93.ondigitalocean.app/:${port}`);
});

