// ScheduleDisplay.js
import React from 'react';

const ScheduleDisplay = ({ selectedCourses }) => {
  if (!selectedCourses || selectedCourses.length === 0) {
    return (
      <div>
        <h2>No Courses Selected</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Selected Courses Schedule</h2>
      <ul>
        {selectedCourses.map(course => (
          <li key={course.ID}>
            <strong>{course.NOMBRE}</strong> - {course.APELLIDOS}, {course.NOMBRES}<br />
            <strong>Docente:</strong> {course.DOCENTE}<br />
            <strong>Periodo:</strong> {course.PERIODO}, <strong>Anio:</strong> {course.ANIO}<br />
            <strong>Dia:</strong> {course.DIA}<br />
            <strong>Horario:</strong> {course.HORARIO}<br />
            <strong>Ambiente:</strong> {course.AMBIENTE}<br />
            <strong>Semestre:</strong> {course.SEMESTRE}, <strong>Nombre:</strong> {course.NOMBRE}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleDisplay;
