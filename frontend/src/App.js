import './App.css';
import React, { useState } from 'react';
import Schedule from './components/Schedule';
import CourseDropdown from './components/CourseDropdown';
import CoursesList from './components/courseList'; // Adjust the import path as necessary

function App() {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <CoursesList />
    </div>
  );
}

export default App;
