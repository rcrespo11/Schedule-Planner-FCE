import React, { useState, useEffect } from 'react';

const CourseDropdown = ({ onCourseSelect, selectedCourses }) => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedNombre, setSelectedNombre] = useState('');
  const [selectedNombres, setSelectedNombres] = useState('');

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

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedNombre('');
    setSelectedNombres('');
  };

  const handleNombreChange = (event) => {
    setSelectedNombre(event.target.value);
    setSelectedNombres('');
  };

  const handleNombresChange = (event) => {
    setSelectedNombres(event.target.value);
  };

  const handleCourseSelect = (course) => {
    const isSelected = selectedCourses.some(selected => selected.id === course.id);
    if (isSelected) {
      onCourseSelect(selectedCourses.filter(selected => selected.id !== course.id));
    } else {
      onCourseSelect([...selectedCourses, course]);
    }
  };

  const renderDropdown = (course) => {
    const isSelected = selectedCourses.some(selected => selected.id === course.id);

    return (
      <div key={course.id} style={{ marginLeft: '20px' }}>
        <input
          type="checkbox"
          id={course.id}
          checked={isSelected}
          onChange={() => handleCourseSelect(course)}
        />
        <label htmlFor={course.id}>
          <strong>Nombre:</strong> {course.NOMBRE}, <strong>Día:</strong> {course.DIA}, <strong>Horario:</strong> {course.HORARIO}
        </label>
      </div>
    );
  };

  // Organize courses by SEMESTRE, Nombre, and Nombres
  const coursesHierarchy = courses.reduce((acc, course) => {
    const semester = course.SEMESTRE;
    const nombre = course.NOMBRE;
    const nombres = course.NOMBRES;

    if (!acc[semester]) {
      acc[semester] = {};
    }
    if (!acc[semester][nombre]) {
      acc[semester][nombre] = {};
    }
    if (!acc[semester][nombre][nombres]) {
      acc[semester][nombre][nombres] = [];
    }
    acc[semester][nombre][nombres].push(course);

    return acc;
  }, {});

  return (
    <div>
      <h2>Select Courses</h2>
      <div>
        <label htmlFor="semester">Semester:</label>
        <select id="semester" onChange={handleSemesterChange} value={selectedSemester}>
          <option value="">Select a Semester</option>
          {Object.keys(coursesHierarchy).map((semester, index) => (
            <option key={index} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      {selectedSemester && (
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <select id="nombre" onChange={handleNombreChange} value={selectedNombre}>
            <option value="">Select a Nombre</option>
            {Object.keys(coursesHierarchy[selectedSemester] || {}).map((nombre, index) => (
              <option key={index} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedNombre && (
        <div>
          <label htmlFor="nombres">Nombres:</label>
          <select id="nombres" onChange={handleNombresChange} value={selectedNombres}>
            <option value="">Select Nombres</option>
            {Object.keys(coursesHierarchy[selectedSemester][selectedNombre] || {}).map((nombres, index) => (
              <option key={index} value={nombres}>
                {nombres}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedNombres && (
        <div>
          <h3>Selected Courses</h3>
          {coursesHierarchy[selectedSemester][selectedNombre][selectedNombres].map(course =>
            renderDropdown(course)
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDropdown;









