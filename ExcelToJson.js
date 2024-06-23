const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('Oferta.xlsx');

// Get the first sheet
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert the sheet to JSON
let data = XLSX.utils.sheet_to_json(sheet);

// Separate the metadata from the classes
const metadata = data.shift();

// Initialize an object for the courses
const courses = {};

// For each class, add it to the array of the corresponding course
data.forEach((classData) => {
  const course = classData.Course;
  if (!courses[course]) {
    courses[course] = {
      metadata: metadata[course],
      classes: [],
    };
  }
  
  courses[course].classes.push(classData);
});

// Write each course to a file
Object.keys(courses).forEach((course) => {
  fs.writeFileSync(`${course}.json`, JSON.stringify(courses[course], null, 2));
});