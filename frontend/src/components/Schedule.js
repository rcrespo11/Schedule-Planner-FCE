import React from 'react';

const Schedule = ({ selectedCourses }) => {
  // Function to get courses for a specific day and time
  const getCoursesForDayAndTime = (day, time) => {
    return selectedCourses.filter(course => course.DIA === day && course.HORA === time);
  };

  return (
    <div className="schedule">
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 17 }, (_, index) => index + 6).map((hour) => (
            <tr key={hour}>
              <td>{`${hour < 10 ? '0' : ''}${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`}</td>
              <td>
                {getCoursesForDayAndTime('Monday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.id} style={{ color: 'red' }}>{course.NOMBRE}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Tuesday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.id} style={{ color: 'red' }}>{course.NOMBRE}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Wednesday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.id} style={{ color: 'red' }}>{course.NOMBRE}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Thursday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.id} style={{ color: 'red' }}>{course.NOMBRE}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Friday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.id} style={{ color: 'red' }}>{course.NOMBRE}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;


