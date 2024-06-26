import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import CourseDropdown from './components/CourseDropdown'; // Adjust path as per your project structure
import Schedule from './components/Schedule'; // Adjust path as per your project structure

const App = () => {
  // State to manage selected courses
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Function to handle course selection
  const handleCourseSelect = (course) => {
    // Check if the course is already selected
    const isSelected = selectedCourses.some(selectedCourse =>
      selectedCourse.id === course.id && selectedCourse.day === course.day && selectedCourse.time === course.time
    );

    // If the course is selected, remove it; otherwise, add it
    if (isSelected) {
      setSelectedCourses(prevCourses => prevCourses.filter(selectedCourse =>
        !(selectedCourse.id === course.id && selectedCourse.day === course.day && selectedCourse.time === course.time)
      ));
    } else {
      setSelectedCourses(prevCourses => [...prevCourses, course]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Planificador de horarios</h1>
      </header>
      <main>
        <div className="container">
          <div className="row">
            
            <div className="col-md-8">
              <Schedule selectedCourses={selectedCourses} />
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p> LINKS LINKS LINKS</p>
      </footer>
    </div>
  );
};

export default App;
