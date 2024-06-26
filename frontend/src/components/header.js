import React from 'react';
import './Header.css'; // Import CSS for header styling

const Header = () => {
  return (
    <div className="header-container">
      <img src="/TC.jpeg" alt="Header Background" className="header-background" />
      <div className="header-content">
        <h1>Header Title</h1>
        {/* Add any additional content you want in the header */}
      </div>
    </div>
  );
};

export default Header;
