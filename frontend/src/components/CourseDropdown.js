import React, { useState, useEffect } from 'react';

const CourseDropdown = ({ onCourseSelect, selectedCourses }) => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedNombre, setSelectedNombre] = useState('');
  const [selectedNombres, setSelectedNombres] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/courses')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Add a unique id to each course
        const coursesWithId = data.map(course => ({
          ...course,
          id: `${course.NOMBRE}-${course.DIA}-${course.HORARIO}` // Combine properties to create a unique id
        }));
        setCourses(coursesWithId);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedNombre('');
    setSelectedNombres('');
    setSelectedGrupo('');
  };

  const handleNombreChange = (event) => {
    setSelectedNombre(event.target.value);
    setSelectedNombres('');
    setSelectedGrupo('');
  };

  const handleNombresChange = (event) => {
    setSelectedNombres(event.target.value);
    setSelectedGrupo('');
  };

  const handleGrupoChange = (event) => {
    setSelectedGrupo(event.target.value);
  };

  const handleCourseSelect = () => {
    const selectedCoursesInGroup = coursesHierarchy[selectedSemester][selectedNombre][selectedNombres][selectedGrupo];
    const mergedCourse = selectedCoursesInGroup.reduce((acc, course) => {
      acc.NOMBRE = course.NOMBRE;
      acc.HORARIOS = acc.HORARIOS || [];
      acc.HORARIOS.push({ DIA: course.DIA, HORARIO: course.HORARIO });
      return acc;
    }, {});

    const isSelected = selectedCourses.some(selected => selected.NOMBRE === mergedCourse.NOMBRE);
    if (isSelected) {
      onCourseSelect(selectedCourses.filter(selected => selected.NOMBRE !== mergedCourse.NOMBRE));
    } else {
      onCourseSelect([...selectedCourses, mergedCourse]);
    }
  };

  // Build the hierarchy
  const coursesHierarchy = courses.reduce((acc, course) => {
    const semester = course.SEMESTRE;
    const nombre = course.NOMBRE;
    const nombres = course.NOMBRES;
    const grupo = course.GRUPO;

    if (!acc[semester]) {
      acc[semester] = {};
    }
    if (!acc[semester][nombre]) {
      acc[semester][nombre] = {};
    }
    if (!acc[semester][nombre][nombres]) {
      acc[semester][nombre][nombres] = {};
    }
    if (!acc[semester][nombre][nombres][grupo]) {
      acc[semester][nombre][nombres][grupo] = [];
    }
    acc[semester][nombre][nombres][grupo].push(course);

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
          <label htmlFor="grupo">Grupo:</label>
          <select id="grupo" onChange={handleGrupoChange} value={selectedGrupo}>
            <option value="">Select Grupo</option>
            {Object.keys(coursesHierarchy[selectedSemester][selectedNombre][selectedNombres] || {}).map((grupo, index) => (
              <option key={index} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedGrupo && (
        <div>
          <h3>Selected Courses</h3>
          <div style={{ marginLeft: '20px' }}>
            <input
              type="checkbox"
              id={`${selectedNombre}-${selectedNombres}-${selectedGrupo}`}
              onChange={handleCourseSelect}
              checked={selectedCourses.some(course => course.NOMBRE === selectedNombre)}
            />
            <label htmlFor={`${selectedNombre}-${selectedNombres}-${selectedGrupo}`}>
              <strong>Nombre:</strong> {selectedNombre}
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDropdown;













