import React, { useState, useEffect } from "react";
import Translation from "../../components/Transaltion/Translation";  
import TranslationPart from "../../components/Transaltion/TranslationPart";
import { FaTimes } from "react-icons/fa"; 
import "./Challenges.css";
import "../../colors.css";
import AccuracyBar from "../../components/Accuracy/Accuracy";
import { useLocation } from "react-router-dom";

function Challenges() {
  const location = useLocation();
  
  // Check if location.state is null or undefined and provide fallback values
  const { paragraph , correct_translation , points = 0, timer_seconds , source_language = "" } = location.state || {}; 
  console.log("paragraphhhh",paragraph)
  const [translatedText, setTranslatedText] = useState(""); 
  const [strokeDashoffset, setStrokeDashoffset] = useState(0); 
  const [timerRunning, setTimerRunning] = useState(false); 
  const [showProgress, setShowProgress] = useState(false); 
  const [accuracy, setAccuracy] = useState(0); 
  const [isInputDisabled, setIsInputDisabled] = useState(false); 
  const [showCard, setShowCard] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(timer_seconds);
  const totalDuration = timer_seconds; 
  const [text, setText] = useState('');

  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200); // Vibrate for 200ms
    }
  };

  const handleTextChange = (input) => {
    if (!isInputDisabled) {
      setText(input); 
    }
  };

  const handleBackClick = () => {
    window.history.back(); 
  };

  const calculateAccuracy = () => {
    // Placeholder for actual accuracy calculation logic
    const correctWords = paragraph.split(' ').filter((word, index) => word === translatedText.split(' ')[index]).length;
    return Math.round((correctWords / paragraph.split(' ').length) * 100);
  };

  const startTimer = () => {
    setTimerRunning(true); 
    setTranslatedText(paragraph);  
    setIsInputDisabled(false); 

    triggerVibration();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          setShowProgress(true);
          const calculatedAccuracy = calculateAccuracy();
          setAccuracy(calculatedAccuracy);
          setIsInputDisabled(true);
          setTranslatedText(correct_translation); 
          setShowCard(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Ensure timer cleanup
  };

  useEffect(() => {
    if (timerRunning) {
      const percentage = (timeLeft / totalDuration) * 100;
      setStrokeDashoffset(440 - (440 * percentage) / 100);
    }
  }, [timeLeft, timerRunning]);

  const getObservationMessage = () => {
    if (accuracy < 50) return "You need more effort. Keep practicing!";
    if (accuracy < 70) return "Good job! You win 5 leaves!";
    if (accuracy < 100) return "Very good! You win 8 leaves!";
    return "Excellent! You win 100 leaves!";
  };

  return (
    <div className="main-content">
      <div className="timer-container">
        {!showProgress && (
          <svg className="progress-circle" width="150" height="150">
            <circle
              cx="75"
              cy="75"
              r="70"
              className="progress-bg"
              stroke="#ddd"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="75"
              cy="75"
              r="70"
              className="progress"
              stroke={timeLeft <= 10 ? "#ff0000" : "var(--green-primary)"}
              strokeWidth="10"
              fill="none"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.3s, stroke 0.3s" }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="24"
              fill={timeLeft <= 10 ? "#ff0000" : "#333"}
            >
              {timeLeft}s
            </text>
          </svg>
        )}
      </div>

      {!timerRunning && !showProgress && (
        <button className="start-button" onClick={startTimer}>
          Start Timer
        </button>
      )}

      {showProgress && <AccuracyBar accuracy={accuracy} />}

      <Translation />

      <TranslationPart
        text={text}
        Textgiven={translatedText}
        onTextChange={handleTextChange}
        isInputDisabled={isInputDisabled}
      />

      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>

      {showCard && (
        <div className="accuracy-card">
          <button className="close-card" onClick={() => setShowCard(false)}>
            <FaTimes />
          </button>
          <h3>Accuracy: {accuracy}%</h3>
          <p style={{ color: "green" }}>{getObservationMessage()}</p>

          {accuracy > 50 && (
            <img className="pic3" src={process.env.PUBLIC_URL + '/Pics/leaf.png'} alt="Leaf" />
          )}
        </div>
      )}
    </div>
  );
}

export default Challenges;
