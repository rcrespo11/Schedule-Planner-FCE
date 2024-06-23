import React, { useState, useEffect } from 'react';

const CourseDropdown = ({ onCourseSelect, selectedCourses }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/courses')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        return response.text(); // First, get the response text.
      })
      .then(text => {
        console.log(text); // Log the text to see what we got.
        return JSON.parse(text); // Then attempt to parse it as JSON.
      })
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);
  const handleCourseSelect = (course) => {
    if (selectedCourses.some(selected => selected.id === course.id)) {
      onCourseSelect(selectedCourses.filter(selected => selected.id !== course.id));
    } else {
      onCourseSelect([...selectedCourses, course]);
    }
  };

  const renderDropdown = (semester, materia, docente, course) => {
    return (
      <div key={course.id} style={{ marginLeft: '20px' }}>
        <input
          type="checkbox"
          id={course.id}
          checked={selectedCourses.some(selected => selected.id === course.id)}
          onChange={() => handleCourseSelect(course)}
        />
        <label htmlFor={course.id}>{course.NOMBRE}</label>
      </div>
    );
  };

  const coursesHierarchy = courses.reduce((acc, course) => {
    const semester = course.SEMESTRE;
    const materia = course.MATERIA;
    const docente = course.DOCENTE;

    if (!acc[semester]) {
      acc[semester] = {};
    }
    if (!acc[semester][materia]) {
      acc[semester][materia] = {};
    }
    if (!acc[semester][materia][docente]) {
      acc[semester][materia][docente] = [];
    }
    acc[semester][materia][docente].push(course);

    return acc;
  }, {});

  return (
    <div>
      {Object.keys(coursesHierarchy).map((semester) => (
        <div key={semester}>
          <strong>{semester}</strong>
          {Object.keys(coursesHierarchy[semester]).map((materia) => (
            <div key={materia} style={{ marginLeft: '20px' }}>
              <strong>{materia}</strong>
              {Object.keys(coursesHierarchy[semester][materia]).map((docente) => (
                <div key={docente} style={{ marginLeft: '20px' }}>
                  <strong>{docente}</strong>
                  {coursesHierarchy[semester][materia][docente].map(course =>
                    renderDropdown(semester, materia, docente, course)
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseDropdown;

