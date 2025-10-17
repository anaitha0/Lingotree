import React from 'react';
import './Title.css';
import"../../colors.css";
const Title = ({ title, unit }) => {
  return (
    <div className="card">
      
      <div className="card-content">
        
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default Title;
