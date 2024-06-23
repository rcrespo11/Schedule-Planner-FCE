import React, { useState, useEffect } from 'react';

function Schedule() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Replace 'http://localhost:5000/courses' with your actual API endpoint
    fetch('http://localhost:5000/courses')
      .then(response => response.json())
      .then(data => {
        // Sort the data by semester, then by materia, then by docente
        data.sort((a, b) => {
          if (a.semester !== b.semester) {
            return a.semester - b.semester;
          } else if (a.materia !== b.materia) {
            return a.materia.localeCompare(b.materia);
          } else {
            return a.docente.localeCompare(b.docente);
          }
        });
        setCourses(data);
      });
  }, []);

  return (
    <select>
      {courses.map((course, index) => (
        <option key={index} value={course.id}>
          {course.semester} - {course.materia} - {course.docente}
        </option>
      ))}
    </select>
  );
}

export default Schedule;