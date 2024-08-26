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
  
    return coursesForDay.map((course, index) => {
      const horarioForDay = course.HORARIOS.find(horario => horario.DIA === day);
      return (
        <div key={`${day}-${time}-${index}`} className={`course-text ${courseColors[course.NOMBRE] || ''}`}>
          <strong style={{ fontSize: '10px' }}>{course.NOMBRE}</strong>
          <div className="course-info">
            <span style={{ fontSize: '11px' }}>{horarioForDay?.AMBIENTE || 'N/A'}</span>
            <span style={{ fontSize: '11px' }}>G: {course.GRUPO}</span>
          </div>
        </div>
      );
    });
  };

  const downloadPDF = useCallback(() => {
    const input = calendarRef.current;
    if (!input) {
      console.error('Calendar element not found');
      return;
    }

    const originalStyles = {
      width: input.style.width,
      height: input.style.height,
      transform: input.style.transform,
      position: input.style.position,
    };

    input.style.width = '1920px'; // Adjust as needed
    input.style.height = 'auto';
    input.style.transform = 'scale(1)';
    input.style.position = 'absolute';

    html2canvas(input, { useCORS: true, logging: true }).then((canvas) => {
      Object.assign(input.style, originalStyles);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('calendar.pdf');
    }).catch(error => {
      console.error('Error capturing calendar:', error);
      Object.assign(input.style, originalStyles);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 mb-4"> {/* Adjusted width and added margin-bottom */}
          <CourseDropdown onCourseSelect={handleCourseSelect} selectedCourses={selectedCourses} />
          <button onClick={downloadPDF} className="btn btn-primary mt-3">
            Descargar horario en PDF
          </button>
        </div>
        <div className="col-md-8"> {/* Adjusted width */}
          <div ref={calendarRef}>
            <table className="table table-bordered schedule">
              <thead>
                <tr>
                  <th>HORA</th>
                  <th>LUNES</th>
                  <th>MARTES</th>
                  <th>MIERCOLES</th>
                  <th>JUEVES</th>
                  <th>VIERNES</th>
                  <th>SABADO</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 11 }, (_, index) => {
                  const baseHour = 6; // Start from 6 AM
                  const baseMinute = 45; // Start from 45 minutes
                  const interval = 90; // 1 hour 30 minutes in minutes
                  const hour = baseHour + Math.floor((baseMinute + index * interval) / 60);
                  const minute = (baseMinute + index * interval) % 60;
                  const time = `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${hour < 12 ? 'AM' : 'PM'}`;

                  return (
                    <tr key={time}>
                      <td>{time}</td>
                      <td className="schedule-cell">{renderCourseCell('LU', time)}</td>
                      <td className="schedule-cell">{renderCourseCell('MA', time)}</td>
                      <td className="schedule-cell">{renderCourseCell('MI', time)}</td>
                      <td className="schedule-cell">{renderCourseCell('JU', time)}</td>
                      <td className="schedule-cell">{renderCourseCell('VI', time)}</td>
                      <td className="schedule-cell">{renderCourseCell('SA', time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const isHourInRange = (range, hour) => {
  const [start, end] = range.split(' - ');
  return hour >= start.trim() && hour <= end.trim();
};

export default Schedule;
























