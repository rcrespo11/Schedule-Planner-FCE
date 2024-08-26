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
    if (!selectedDocente) {
      console.error('No docente selected');
      return;
    }

    const [apellidos, nombres] = selectedDocente.split(' ');
    const selectedCoursesInGroup = coursesHierarchy[selectedSemester]?.[selectedNombre]?.[selectedDocente]?.[grupo];

    if (!selectedCoursesInGroup) {
      console.error('No courses found for the selected combination');
      return;
    }

    const mergedCourse = {
      NOMBRE: selectedNombre,
      SEMESTRE: selectedSemester,
      APELLIDOS: apellidos,
      NOMBRES: nombres,
      GRUPO: grupo,
      HORARIOS: selectedCoursesInGroup.map(course => ({
        DIA: course.DIA,
        HORARIO: course.HORARIO,
        AMBIENTE: course.AMBIENTE // Include AMBIENTE for each day
      }))
    };

    onCourseSelect(prevSelectedCourses => {
      const isAlreadySelected = isCourseSelected(grupo);
      if (isAlreadySelected) {
        // Remove the course if it's already selected
        return prevSelectedCourses.filter(course => 
          !(course.NOMBRE === mergedCourse.NOMBRE && 
            course.GRUPO === mergedCourse.GRUPO &&
            course.SEMESTRE === mergedCourse.SEMESTRE &&
            course.APELLIDOS === mergedCourse.APELLIDOS &&
            course.NOMBRES === mergedCourse.NOMBRES)
        );
      } else {
        // Add the course if it's not selected
        return [...prevSelectedCourses, mergedCourse];
      }
    });
  };

  const isCourseSelected = (grupo) => {
    if (!selectedDocente) return false;
    const [apellidos, nombres] = selectedDocente.split(' ');
    return selectedCourses.some(course =>
      course.NOMBRE === selectedNombre &&
      course.GRUPO === grupo &&
      course.SEMESTRE === selectedSemester &&
      course.APELLIDOS === apellidos &&
      course.NOMBRES === nombres
    );
  };

  const handleDocenteChange = (event) => {
    setSelectedDocente(event.target.value);
  };


  // Build the hierarchy
  const coursesHierarchy = courses.reduce((acc, course) => {
    const semester = course.SEMESTRE;
    const nombre = course.NOMBRE;
    const docenteKey = `${course.APELLIDOS} ${course.NOMBRES}`;
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
          {Object.entries(coursesHierarchy[selectedSemester]?.[selectedNombre]?.[selectedDocente] || {}).map(([grupo, courses], index) => {
            if (!courses || courses.length === 0) return null;
            
            const isSelected = isCourseSelected(grupo);
            
            return (
              <div key={index} style={{ marginBottom: '50px' }}>
                <input
                  type="checkbox"
                  id={`${selectedNombre}-${selectedDocente}-${grupo}`}
                  onChange={() => handleCourseSelect(grupo)}
                  checked={isSelected}
                />
                <label htmlFor={`${selectedNombre}-${selectedDocente}-${grupo}`} style={clickableStyle}>
                  <strong>Grupo:</strong> {grupo} - <strong>Horarios:</strong> {
                    courses.map(course => `${course.DIA} ${course.HORARIO}`).join(', ')
                  } - <strong>Ambiente:</strong> {courses[0]?.AMBIENTE || 'N/A'}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseDropdown;

