import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import CourseDropdown from './components/CourseDropdown'; // Adjust path as per your project structure
import Schedule from './components/Schedule'; // Adjust path as per your project structure
import centroImage from './Centro.jpeg';

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
        <div className="col-md-4 ">
              <img 
                src={centroImage} // Replace with your image path
                alt="Descriptive text"
                style={{ maxWidth: '100%', paddingLeft: '300px' , marginLeft: 200, marginTop: 500}}
              />
            </div>
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
        <a>Nuestras redes:   </a>
        <a href="https://www.facebook.com/share/hr7GwvR62DLx5e3g/" target="_blank" rel="noopener noreferrer" className="facebook-link">Facebook</a> |
        <a href="https://www.instagram.com/t.c.transformando_comercial?utm_source=qr&igsh=NWk2YTV5MmZlOHZi" target="_blank" rel="noopener noreferrer" className="instagram-link">Instagram</a> |
        <a href="https://www.tiktok.com/@transformando_comercial_?_t=8nYD8Z2fKRp&_r=1" target="_blank" rel="noopener noreferrer" className="tiktok-link">TikTok</a>
      </footer>
    </div>
  );
};

export default App;

