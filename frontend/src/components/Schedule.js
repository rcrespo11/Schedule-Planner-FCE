import React, { useState, useRef, useCallback } from 'react';
import CourseDropdown from './CourseDropdown'; // Adjust the path as per your file structure
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Ensure this import is present
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Schedule = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseColors, setCourseColors] = useState({});
  const [colorIndex, setColorIndex] = useState(1);
  const calendarRef = useRef(null);

  const handleCourseSelect = (updateFunction) => {
    setSelectedCourses(prevSelectedCourses => {
      const updatedCourses = updateFunction(prevSelectedCourses);
      const newCourseColors = { ...courseColors };

      updatedCourses.forEach(course => {
        if (!newCourseColors[course.NOMBRE]) {
          newCourseColors[course.NOMBRE] = `course-color-${colorIndex}`;
          setColorIndex((prevIndex) => (prevIndex % 7) + 1);
        }
      });

      setCourseColors(newCourseColors);
      return updatedCourses;
    });
  };

  const renderCourseCell = (day, time) => {
    const coursesForDay = selectedCourses.filter(course =>
      course.HORARIOS.some(horario => horario.DIA === day && isHourInRange(horario.HORARIO, time))
    );

    return coursesForDay.map((course, index) => (
      <div key={`${day}-${time}-${index}`} className={`course-text ${courseColors[course.NOMBRE] || ''}`}>
        <strong style={{ fontSize: '10px' }}>{course.NOMBRE}</strong>
        <div className="course-info">
          {course.HORARIOS.map((horario, hIndex) => (
            <div key={hIndex}>
              <span style={{ fontSize: '11px' }}>{course.AMBIENTE[horario.DIA] || 'N/A'}</span>
              <span style={{ fontSize: '11px' }}>G: {course.GRUPO}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const isHourInRange = (horaCurso, horaCell) => {
    const [start, end] = horaCurso.split('-').map(h => {
      const [hours, minutes] = h.split(':').map(Number);
      return hours * 60 + minutes;
    });
    const [cellHours, cellMinutes] = horaCell.split(':').map(Number);
    const cellTime = cellHours * 60 + cellMinutes;

    return cellTime >= start && cellTime <= end;
  };

  const handleDownload = useCallback(() => {
    if (calendarRef.current) {
      html2canvas(calendarRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position -= pdf.internal.pageSize.getHeight();
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save('schedule.pdf');
      });
    }
  }, [calendarRef]);

  return (
    <div>
      <CourseDropdown onCourseSelect={handleCourseSelect} selectedCourses={selectedCourses} />
      <div ref={calendarRef} className="calendar-container">
        <table className="calendar-table">
          <thead>
            <tr>
              <th></th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, index) => (
              <tr key={index}>
                <td>{`${8 + index}:00`}</td>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, dayIndex) => (
                  <td key={dayIndex}>{renderCourseCell(day, `${8 + index}:00`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleDownload}>Download as PDF</button>
      </div>
    </div>
  );
};

export default Schedule;

























