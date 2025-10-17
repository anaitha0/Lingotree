import React from "react";

import "./MCQ.css";
import "../../colors.css";
import "../../assests/fonts.css"
function MCQ({
  englishSentence,
  choices,
  selectedIndex,
  setSelectedIndex,
  sentenceLanguage, // Accept the sentence language prop
}) {
  return (
    <div className="mcq-exercise">
      <div className="question" style={{ marginBottom: "0px" }}>
        <h2 className="title" style={{ color: "#2d3a3f" }}>
          {sentenceLanguage === "English"
            ? "Translate the following sentence:"
            : "ترجم الجملة التالية"}
        </h2>
        <p className="sentence">{englishSentence}</p>
      </div>

      {/* Display Multiple Choice Options */}
      <div className="choices-container">
        {choices.map((choice, index) => (
          <div
            key={index}
            className={`choice-card ${selectedIndex === index ? "selected" : ""}`}
            onClick={() => setSelectedIndex(index)} // Call setSelectedIndex here
          >
            {choice.join(" ")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MCQ;
