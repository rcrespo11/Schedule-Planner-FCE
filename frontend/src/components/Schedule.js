import React, { useState, useEffect } from 'react';
import CourseDropdown from './CourseDropdown'; // Adjust the path as per your file structure
import 'bootstrap/dist/css/bootstrap.min.css';

const Schedule = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch courses from database
  useEffect(() => {
    fetch('http://localhost:5000/courses')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  // Function to handle course selection
  const handleCourseSelect = (course) => {
    const isSelected = selectedCourses.some(selectedCourse =>
      selectedCourse.id === course.id && selectedCourse.DIA === course.DIA && selectedCourse.HORARIO === course.HORARIO
    );

    if (isSelected) {
      setSelectedCourses(prevCourses =>
        prevCourses.filter(selectedCourse =>
          !(selectedCourse.id === course.id && selectedCourse.DIA === course.DIA && selectedCourse.HORARIO === course.HORARIO)
        )
      );
    } else {
      setSelectedCourses(prevCourses => [...prevCourses, course]);
    }
  };

  // Function to parse start and end times from HORARIO
  const parseTimes = (horario) => {
    const [start, end] = horario.split(' - ');
    return { start, end };
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
                return { hour, minute };
              }).map(({ hour, minute }) => (
                <tr key={`${hour}:${minute}`}>
                  <td>{`${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${hour < 12 ? 'AM' : 'PM'}`}</td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'LU' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'MA' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'MI' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'JU' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'VI' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                  <td>
                    {selectedCourses.filter(course =>
                      course.DIA === 'SA' && parseTimes(course.HORARIO).start === `${hour}:${minute < 10 ? '0' : ''}${minute}`
                    ).map(course => (
                      <div key={`${course.id}-${course.DIA}-${course.HORARIO}`} className="text-danger">
                        {`${course.NOMBRE} (${course.DIA} - ${course.HORARIO})`}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;









