import React, { useEffect, useState } from "react";
import "./Accuracy.css";

const AccuracyBar = ({ accuracy, style }) => {
  const [currentAccuracy, setCurrentAccuracy] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAccuracy((prev) => {
        if (prev >= accuracy) {
          clearInterval(interval);
          return accuracy;
        }
        return prev + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [accuracy]);

  return (
    <div className="accuracy-container-with-label" style={style}>
        <div className="accuracy-label">
        <span>{`Accuracy: ${currentAccuracy}%`}</span>
      </div>
      <div className="accuracy-container">
        <div
          className="accuracy-fill"
          style={{ width: `${currentAccuracy}%` }}
        ></div>
        <span className="accuracy-text">{`${currentAccuracy}%`}</span>
      </div>
      
    </div>
  );
};

export default AccuracyBar;
