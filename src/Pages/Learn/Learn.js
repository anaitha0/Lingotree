import React, { useState } from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Translation from "../../components/Transaltion/Translation";
import TranslationPart from "../../components/Transaltion/TranslationPart";
import BottomLearn from "../../components/BottomLearn/BottomLearn";
import './Learn.css';
import"../../colors.css";
function Learn() {
  const [progress, setProgress] = useState(40);
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [answerStatus, setAnswerStatus] = useState(""); // "excellent" or "wrong"
  const [isCheckMode, setIsCheckMode] = useState(true); // Toggles between "Check" and "Continue"

  const translateText = (input) => {
    return input
      .split(" ")
      .map((word) => word.split("").reverse().join(""))
      .join(" ");
  };

  const handleTextChange = (input) => {
    setText(input);
    setTranslatedText(translateText(input));
  };

  const handleButtonClick = () => {
    if (isCheckMode) {
      // Check logic
      if (text.trim() && text === translatedText.split("").reverse().join("")) {
        setAnswerStatus("excellent");
      } else {
        setAnswerStatus("excellent");
      }
      setIsCheckMode(false); // Switch to "Continue"
    } else {
      // Continue logic
      setAnswerStatus("");
      setText("");
      setTranslatedText("");
      setProgress((prev) => Math.min(prev + 10, 100)); 
      setIsCheckMode(true); // Switch back to "Check"
    }
  };

  return (
    <div className="main-content">
     
        <ProgressBar progress={progress}/>
     
      <Translation />
      <TranslationPart
        text={text}
        translatedText={translatedText}
        onTextChange={handleTextChange}
      />
      {/* <div className="save">
        <img
          className="savepic"
          src={`${process.env.PUBLIC_URL}/Pics/save.png`}
          alt="Save Icon"
        />
      </div>*/}
      
      <BottomLearn
        isCheckMode={isCheckMode}
        onButtonClick={handleButtonClick}
        answerStatus={answerStatus}
      />
    </div>
  );
}

export default Learn;
