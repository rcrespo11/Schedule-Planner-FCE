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
  host: 'nuskkyrsgmn5rw8c.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'zrnqoodol2tt2kjf',
  password: 'h9ihisvn1pxsde1v',
  database: 'p9d5zs72occev6kd',
  port: 3306
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
