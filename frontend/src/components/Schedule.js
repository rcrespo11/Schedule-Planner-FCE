import React, { useState } from 'react';

const Schedule = () => {
  // Dummy schedule data (replace with actual data fetched from backend)
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Function to handle course selection
  const handleCourseSelect = (course) => {
    // Check if a course with the same time and day already exists
    const isCourseSelected = selectedCourses.some(selectedCourse =>
      selectedCourse.day === course.day && selectedCourse.time === course.time && selectedCourse.course === course.course
    );

    // If the course is not selected yet, add it to the selectedCourses array
    if (!isCourseSelected) {
      setSelectedCourses(prevCourses => [...prevCourses, course]);
    }
  };

  // Function to get courses for a specific day and time
  const getCoursesForDayAndTime = (day, time) => {
    return selectedCourses.filter(course => course.day === day && course.time === time);
  };

  return (
    <div className="schedule">
      <div className="course-selection">
        <label htmlFor="course">Select Course:</label>
        <select id="course" onChange={(e) => handleCourseSelect(JSON.parse(e.target.value))}>
          <option value="">Select Course</option>
          <option value={JSON.stringify({ course: 'Course A', day: 'Monday', time: '9:00 AM' })}>Course A</option>
          <option value={JSON.stringify({ course: 'Course B', day: 'Tuesday', time: '10:00 AM' })}>Course B</option>
          <option value={JSON.stringify({ course: 'Course C', day: 'Wednesday', time: '11:00 AM' })}>Course C</option>
          <option value={JSON.stringify({ course: 'Course D', day: 'Monday', time: '9:00 AM' })}>Course D</option>
          {/* Add more course options as needed */}
        </select>
      </div>
      <table>
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
                  <div key={course.course} style={{ color: 'red' }}>{course.course}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Tuesday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.course} style={{ color: 'red' }}>{course.course}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Wednesday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.course} style={{ color: 'red' }}>{course.course}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Thursday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.course} style={{ color: 'red' }}>{course.course}</div>
                ))}
              </td>
              <td>
                {getCoursesForDayAndTime('Friday', `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`).map(course => (
                  <div key={course.course} style={{ color: 'red' }}>{course.course}</div>
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

