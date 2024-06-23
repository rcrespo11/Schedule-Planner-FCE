const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Use CORS middleware to allow requests from localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Replace these with your actual MySQL connection details
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '78347118Casa', // Replace with your MySQL password
  database: 'horario', // Replace with your database name
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
