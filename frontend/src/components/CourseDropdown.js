import React, { useState, useEffect } from 'react';

const CourseDropdown = ({ onCourseSelect, selectedCourses }) => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedNombre, setSelectedNombre] = useState('');
  const [selectedNombres, setSelectedNombres] = useState('');
  const [selectedDocente, setSelectedDocente] = useState('');

  useEffect(() => {
    fetch('/api/courses')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      setCourses(data);
    })
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
    const [apellidos, nombres] = event.target.value.split('|');
    setSelectedNombres(apellidos);
  };

  const handleCourseSelect = (grupo) => {
    const selectedCoursesInGroup = coursesHierarchy[selectedSemester][selectedNombre][selectedNombres][grupo];
    const mergedCourse = {
      NOMBRE: selectedNombre,
      SEMESTRE: selectedSemester,
      NOMBRES: selectedNombres,
      GRUPO: grupo,
      HORARIOS: selectedCoursesInGroup.map(course => ({ DIA: course.DIA, HORARIO: course.HORARIO })),
      AMBIENTE: selectedCoursesInGroup[0].AMBIENTE // Assuming AMBIENTE is available in course data
    };
  
    onCourseSelect(prevSelectedCourses => {
      const isSelected = isCourseSelected(grupo);
      if (isSelected) {
        // Remove the course if it's already selected
        return prevSelectedCourses.filter(course => 
          !(course.NOMBRE === mergedCourse.NOMBRE && 
            course.GRUPO === mergedCourse.GRUPO &&
            course.SEMESTRE === mergedCourse.SEMESTRE &&
            course.NOMBRES === mergedCourse.NOMBRES)
        );
      } else {
        // Add the course if it's not selected
        return [...prevSelectedCourses, mergedCourse];
      }
    });
  };

  const isCourseSelected = (grupo) => {
    return selectedCourses.some(course =>
      course.NOMBRE === selectedNombre &&
      course.GRUPO === grupo &&
      course.SEMESTRE === selectedSemester &&
      course.NOMBRES === selectedNombres
    );
  };

  const handleDocenteChange = (event) => {
    setSelectedDocente(event.target.value);
  };


  // Build the hierarchy
  const coursesHierarchy = courses.reduce((acc, course) => {
    const semester = course.SEMESTRE;
    const nombre = course.NOMBRE;
    const docenteKey = `${course.APELLIDOS}, ${course.NOMBRES}`;
    const grupo = course.GRUPO;

    if (!acc[semester]) acc[semester] = {};
    if (!acc[semester][nombre]) acc[semester][nombre] = {};
    if (!acc[semester][nombre][docenteKey]) acc[semester][nombre][docenteKey] = {};
    if (!acc[semester][nombre][docenteKey][grupo]) acc[semester][nombre][docenteKey][grupo] = [];
    acc[semester][nombre][docenteKey][grupo].push(course);

    return acc;
  }, {});


  const clickableStyle = {
    cursor: 'pointer',
     // Add underline effect when hovered
  
  };

  return (
    <div style={{ marginLeft: '-70px' }}>
      <h2 style={{ fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>Selecciona las clases</h2>
      <div>
        <label htmlFor="semester" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>Semestre:</label>
        <select id="semester" onChange={handleSemesterChange} value={selectedSemester} style={{ fontSize: '13px' }}>
          <option value="">Selecciona un semestre</option>
          {Object.keys(coursesHierarchy).map((semester, index) => (
            <option key={index} value={semester}>{semester}</option>
          ))}
        </select>
      </div>

      {selectedSemester && (
        <div>
          <label htmlFor="nombre" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>Materia:</label>
          <select id="nombre" onChange={handleNombreChange} value={selectedNombre} style={{ fontSize: '13px' }}>
            <option value="">Selecciona una materia</option>
            {Object.keys(coursesHierarchy[selectedSemester] || {}).map((nombre, index) => (
              <option key={index} value={nombre}>{nombre}</option>
            ))}
          </select>
        </div>
      )}

{selectedNombre && (
    <div>
      <label htmlFor="docente" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', fontWeight: 'bold' }}>Docente:</label>
      <select id="docente" onChange={handleDocenteChange} value={selectedDocente} style={{ fontSize: '12px' }}>
        <option value="">Selecciona un docente</option>
        {Object.keys(coursesHierarchy[selectedSemester][selectedNombre] || {}).map((docenteKey, index) => (
          <option key={index} value={docenteKey}>
            {docenteKey}
          </option>
        ))}
      </select>
    </div>
  )}

  {selectedDocente && (
    <div>
      <h3 style={{ marginTop: '40px' }}>Grupos disponibles</h3>
      {Object.keys(coursesHierarchy[selectedSemester][selectedNombre][selectedDocente] || {}).map((grupo, index) => (
        <div key={index} style={{ marginBottom: '50px' }}>
          <input
            type="checkbox"
            id={`${selectedNombre}-${selectedDocente}-${grupo}`}
            onChange={() => handleCourseSelect(grupo)}
            checked={isCourseSelected(grupo)}
          />
          <label htmlFor={`${selectedNombre}-${selectedDocente}-${grupo}`} style={clickableStyle}>
            <strong>Grupo:</strong> {grupo} - <strong>Horarios:</strong> {
              coursesHierarchy[selectedSemester][selectedNombre][selectedDocente][grupo]
                .map(course => `${course.DIA} ${course.HORARIO}`).join(', ')
            } - <strong>Ambiente:</strong> {
              coursesHierarchy[selectedSemester][selectedNombre][selectedDocente][grupo][0].AMBIENTE
            }
          </label>
        </div>
      ))}
    </div>
  )}
    </div>
  );
};

export default CourseDropdown;

