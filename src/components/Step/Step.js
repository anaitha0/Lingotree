import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add the router dependency
import "./Step.css";
import "../../colors.css";
import { units } from "../../data/exercises"; // Import units from the new file

const Step = ({ innerCircleColor = "#4caf50 ", icon = "/Pics/whiteleaf.png", progress, index, unitIndex }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(!isPressed);

  
  };

  return (
    <div className="step-wrapper" onClick={handleClick}>
      {/* Progress circle */}
      {progress !== undefined && (
        <svg className="progress-circle" viewBox="0 0 36 36">
          <path
            className="progress-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
          />
          <path
            className="progress-bar"
            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
            style={{ strokeDasharray: `${progress}, 100` }}
          />
        </svg>
      )}
      {/* Outer (bottom) circle */}
      <div className={`outer-circle ${isPressed ? "pressed" : ""}`}>
        <div
          className="inner-circle"
          style={{ backgroundColor: innerCircleColor }}
        >
          <img src={process.env.PUBLIC_URL + icon} className="leaf-icon" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Step;
