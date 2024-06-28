const mysql = require('mysql2');
const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('undefined.json', 'utf8'));

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'dbaas-db-7356385-do-user-17076954-0.c.db.ondigitalocean.com',
  user: 'doadmin',
  password: 'AVNS_DLiC-r-dZBNls4KRkGI',
  database: 'horario',
  port: 25060
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

// For each object in the JSON array, create an INSERT SQL query
data.classes.forEach((classData) => {
  const query = `
    INSERT INTO clases(ANIO, PERIODO, PLAN, NIVEL, DOCENTE, APELLIDOS, NOMBRES, MATERIA, NOMBRE, TIPO, GRUPO, DIA, ORDEN_DIA, HORA, HORARIO, AMBIENTE, SEMESTRE)
    VALUES (${classData.ANIO}, ${classData.PERIODO}, ${classData.PLAN}, '${classData.NIVEL}', ${classData.DOCENTE}, '${classData.APELLIDOS}', '${classData.NOMBRES}', ${classData.MATERIA}, '${classData.NOMBRE}', '${classData.TIPO}', ${classData.GRUPO}, '${classData.DIA}', ${classData.ORDEN_DIA}, ${classData.HORA}, '${classData.HORARIO}', '${classData.AMBIENTE}', ${classData.SEMESTRE})
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log('Data inserted successfully');
  });
});

connection.end();
