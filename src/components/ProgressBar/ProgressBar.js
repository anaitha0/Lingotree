import React from 'react';
import './ProgressBar.css'; // We'll style it using this CSS file
import '../../colors.css'; // For additional styling

const ProgressBar = ({ progress, onIconClick }) => {
  return (
    <div className="progress1">
      {/* Clickable X Icon */}
      <img
        className="Xpic"
        src={process.env.PUBLIC_URL + '/Pics/X.png'}
        alt="Back to Dashboard"
        onClick={onIconClick} // Navigate when clicked
        style={{ cursor: 'pointer' }}
      />

      {/* Progress Bar */}
      <span className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </span>

      {/* Leaf Icon with Progress Percentage */}
      <span className="leaf">
        <img
          className="Xpic"
          src={process.env.PUBLIC_URL + '/Pics/leaf.png'}
          alt="Leaf Icon"
        />
        <div className="text-leaf">{progress}%</div>
      </span>
    </div>
  );
};

export default ProgressBar;
