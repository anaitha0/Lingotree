import React from 'react';
import './Unitcard.css';
import"../../colors.css";
import"../../assests/fonts.css"
const Unitcard = ({ title, unit }) => {
  return (
    <div className="card" style={{ width: '80%' ,marginTop:'35px'}}>
      <span className="unit">{unit}</span>
      <div className="card-content">
        
        <h2 className='h2'>{title}</h2>
      </div>
    </div>
  );
};

export default Unitcard;
