import React, { useState } from "react";

import Translation from "../../components/Transaltion/Translation";
import TranslationPart from "../../components/Transaltion/TranslationPart";
import './Translate.css';
import "../../colors.css";

function Translate() {
  const [text, setText] = useState(""); // Manage input text
  const [translatedText, setTranslatedText] = useState(""); // Manage translated text

  const translateText = (input) => {
    return input
      .split(" ")
      .map((word) => word.split("").reverse().join("")) // Reverses each word
      .join(" ");
  };

  // Handle text input change
  const handleTextChange = (input) => {
    setText(input);
    setTranslatedText(translateText(input));
  };

  // Handle "Back" button click
  const handleBackClick = () => {
    window.history.back(); // Navigate to the previous page
  };

  return (
    
      <div className="main-content">
        {/* Translation Section */}
        <Translation />

        {/* TranslationPart with dynamic text */}
        <TranslationPart
          text={text}
          translatedText={translatedText}
          onTextChange={handleTextChange}
        />

        {/* Back Button */}
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    
  );
}

export default Translate;
