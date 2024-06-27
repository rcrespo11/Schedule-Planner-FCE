const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Database connection setup
const db = mysql.createConnection({
  host: 'db-mysql-nyc3-97524-do-user-17057538-0.c.db.ondigitalocean.com',
  user: 'doadmin',
  password: 'AVNS_sYcDpRswUGHAnYdePSh',
  database: 'horario',
  port: 25060
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');
});

// API routes
app.get('/api/courses', (req, res) => {
  const sql = 'SELECT * FROM clases';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(result);
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
