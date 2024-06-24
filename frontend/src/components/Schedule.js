import React, { useState } from 'react';
import CourseDropdown from './CourseDropdown'; // Adjust the path as per your file structure
import 'bootstrap/dist/css/bootstrap.min.css';

const Schedule = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Function to handle course selection
  const handleCourseSelect = (updatedCourses) => {
    console.log('Updated courses:', updatedCourses); // Keep this log for debugging
    setSelectedCourses(updatedCourses);
    console.log('New selectedCourses state:', updatedCourses);
  };

  // Helper function to format time correctly
  const formatTime = (time) => {
    const [hourMinute, period] = time.split(' ');
    let [hour, minute] = hourMinute.split(':').map(Number);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;
  };

  // Helper function to check if the hour is within the range of HORARIO
  const isHourInRange = (horario, hour) => {
    const [start, end] = horario.split(' - ').map(formatTime);
    return hour >= start && hour < end;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <CourseDropdown onCourseSelect={handleCourseSelect} selectedCourses={selectedCourses} />
        </div>
        <div className="col-md-8">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>LUNES</th>
                <th>MARTES</th>
                <th>MIERCOLES</th>
                <th>JUEVES</th>
                <th>VIERNES</th>
                <th>SABADO</th> {/* Add Saturday here */}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, index) => {
                const baseHour = 6; // Start from 6 AM
                const baseMinute = 45; // Start from 45 minutes
                const interval = 90; // 1 hour 30 minutes in minutes
                const hour = baseHour + Math.floor((baseMinute + index * interval) / 60);
                const minute = (baseMinute + index * interval) % 60;
                const slotTime = `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;

                return (
                  <tr key={`${hour}:${minute}`}>
                    <td>{`${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${hour < 12 ? 'AM' : 'PM'}`}</td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'LU' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'MA' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'MI' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'JU' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'VI' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedCourses.filter(course =>
                        course.DIA === 'SA' &&
                        isHourInRange(course.HORARIO, slotTime)
                      ).map(course => (
                        <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                          {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                        </div>
                      ))}
                    </td>
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

export default Schedule;









