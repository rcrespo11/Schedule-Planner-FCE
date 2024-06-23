import React, { useState, useEffect } from 'react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedNombre, setSelectedNombre] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
    setSelectedNombre('');
  };

  const handleNombreChange = (event) => {
    setSelectedNombre(event.target.value);
  };

  // Organize courses by SEMESTRE and NOMBRE
  const coursesBySemester = courses.reduce((acc, course) => {
    if (!acc[course.SEMESTRE]) {
      acc[course.SEMESTRE] = {};
    }
    if (!acc[course.SEMESTRE][course.NOMBRE]) {
      acc[course.SEMESTRE][course.NOMBRE] = [];
    }
    acc[course.SEMESTRE][course.NOMBRE].push(course);
    return acc;
  }, {});

  return (
    <div>
      <h2>Courses</h2>
      <select onChange={handleSemesterChange} value={selectedSemester}>
        <option value="">Select a Semester</option>
        {Object.keys(coursesBySemester).map((semester, index) => (
          <option key={index} value={semester}>
            Semester {semester}
          </option>
        ))}
      </select>

      {selectedSemester && (
        <>
          <select onChange={handleNombreChange} value={selectedNombre}>
            <option value="">Select a Course</option>
            {Object.keys(coursesBySemester[selectedSemester]).map((nombre, index) => (
              <option key={index} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>

          {selectedNombre && (
            <ul>
              {coursesBySemester[selectedSemester][selectedNombre].map(course => (
                <li key={course.ID}>
                  <strong>{course.NOMBRE}</strong> - {course.APELLIDOS}, {course.NOMBRES}<br />
                  <strong>Docente:</strong> {course.DOCENTE}<br />
                  <strong>Periodo:</strong> {course.PERIODO}, <strong>Anio:</strong> {course.ANIO}<br />
                  <strong>Dia:</strong> {course.DIA}<br />
                  <strong>Horario:</strong> {course.HORARIO}<br />
                  <strong>Ambiente:</strong> {course.AMBIENTE}<br />
                  <strong>Semestre:</strong> {course.SEMESTRE}, <strong>Nombre:</strong> {course.NOMBRE}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesList;



