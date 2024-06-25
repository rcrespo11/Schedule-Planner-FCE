import React, { useState } from 'react';
import CourseDropdown from './CourseDropdown'; // Adjust the path as per your file structure
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Ensure this import is present

const Schedule = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Function to handle course selection
  const handleCourseSelect = (updatedCourses) => {
    console.log('Updated courses:', updatedCourses); // Keep this log for debugging
    setSelectedCourses(updatedCourses);
    console.log('New selectedCourses state:', updatedCourses);
  };

  const renderCourseCell = (day, time) => {
    const coursesForDay = selectedCourses.flatMap(course =>
      course.HORARIOS.filter(horario => horario.DIA === day && isHourInRange(horario.HORARIO, time))
        .map(horario => course.NOMBRE)
    );

    // Remove duplicate course names
    const uniqueCoursesForDay = [...new Set(coursesForDay)];

    return uniqueCoursesForDay.map((courseName, index) => (
      <div key={index} className="course-text red">
        {courseName}
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <CourseDropdown onCourseSelect={handleCourseSelect} selectedCourses={selectedCourses} />
        </div>
        <div className="col-md-8">
          <table className="table table-bordered schedule">
            <thead>
              <tr>
                <th>Time</th>
                <th>LUNES</th>
                <th>MARTES</th>
                <th>MIERCOLES</th>
                <th>JUEVES</th>
                <th>VIERNES</th>
                <th>SABADO</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, index) => {
                const baseHour = 6; // Start from 6 AM
                const baseMinute = 45; // Start from 45 minutes
                const interval = 90; // 1 hour 30 minutes in minutes
                const hour = baseHour + Math.floor((baseMinute + index * interval) / 60);
                const minute = (baseMinute + index * interval) % 60;
                const time = `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${hour < 12 ? 'AM' : 'PM'}`;

                return (
                  <tr key={time}>
                    <td>{time}</td>
                    <td className="schedule-cell">{renderCourseCell('LU', time)}</td>
                    <td className="schedule-cell">{renderCourseCell('MA', time)}</td>
                    <td className="schedule-cell">{renderCourseCell('MI', time)}</td>
                    <td className="schedule-cell">{renderCourseCell('JU', time)}</td>
                    <td className="schedule-cell">{renderCourseCell('VI', time)}</td>
                    <td className="schedule-cell">{renderCourseCell('SA', time)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if the hour is within the range of HORARIO
const isHourInRange = (range, hour) => {
  const [start, end] = range.split(' - ');
  return hour >= start.trim() && hour <= end.trim();
};

export default Schedule;
















