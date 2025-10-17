import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import BottomLearn from "../../components/BottomLearn/BottomLearn";
import MCQ from "../MCQ/MCQ";
import OrderExo from "../OrderExo/OrderExo";
import { useLeaf } from '../../components/Header/LeafContext'; 
import './ExoPage.css'

const ExoPage = () => {
  const { leaf, setLeaf } = useLeaf();
  const navigate = useNavigate();
  const location = useLocation();
  const { exercises, unit, stepNumber, userId } = location.state || { exercises: [], unit, stepNumber, userId }; // Get exercises, unit, step number, and userId from route state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState(0); // Initialize progress at 0
  const [answerStatus, setAnswerStatus] = useState("");
  const [isCheckMode, setIsCheckMode] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [translatedWords, setTranslatedWords] = useState([]);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  const [pointsMessage, setPointsMessage] = useState("");
  const [showPointsMessage, setShowPointsMessage] = useState(false);

  const stepKey = `${unit}_step_${stepNumber}`; // Unique key for current unit and step

  useEffect(() => {
    const savedProgress = localStorage.getItem(`${stepKey}_progress`);
    const savedExerciseIndex = localStorage.getItem(`${stepKey}_exerciseIndex`);

    // If progress and exercise index exist in local storage, use them
    if (savedProgress && savedExerciseIndex) {
      setProgress(Number(savedProgress));
      setCurrentExerciseIndex(Number(savedExerciseIndex));
    }
  }, [stepKey]);

  const currentExercise = exercises[currentExerciseIndex] || {};
  const choices = currentExercise.data?.choices || [];
  const correctArabicSentence = currentExercise.data?.correctArabicSentence || [];
  const englishSentence = currentExercise.data?.englishSentence || "";
  
  // Shuffle function for randomizing the choices
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (currentExercise.type === "MCQ") {
      const choicesWithCorrectAnswer = [...choices, correctArabicSentence];
      const shuffled = shuffleArray(choicesWithCorrectAnswer);
      setShuffledChoices(shuffled);
    }
  }, [choices, correctArabicSentence, currentExercise.type]);

  const checkLanguage = (sentence) => {
    const regexArabic = /[\u0600-\u06FF]/; // Regex for Arabic characters
    return regexArabic.test(sentence) ? "Arabic" : "English";
  };

  // Function to handle adding points via POST request
  const addPoints = async (exerciseId) => {
    const exerciseType = currentExercise.type; 
    const url = `/add-points/adlene/`;
    const body = {
      exercise_id: exerciseId,
      exercise_type: exerciseType,   
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("Points added successfully");
      } else {
        console.error("Failed to add points");
      }
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };

  const handleCheck = () => {
    let isCorrect = false;
  
    if (currentExercise.type === "MCQ") {
      isCorrect =
        selectedIndex !== null &&
        JSON.stringify(shuffledChoices[selectedIndex]) === JSON.stringify(correctArabicSentence);
    } else if (currentExercise.type === "OrderExo") {
      isCorrect = JSON.stringify(translatedWords) === JSON.stringify(correctArabicSentence);
    }
  
    if (isCorrect) {
      setAnswerStatus("excellent");
      setProgress((prevProgress) => Math.min(prevProgress + 10, exercises.length * 10)); // Increment progress by 10
      // Call addPoints function to add points if the answer is correct
      addPoints(currentExercise.data?.id);
      console.log("id",currentExercise.data?.id)
      // Show points message
      setPointsMessage(`+ ${currentExercise.data?.points} Points`);
      setShowPointsMessage(true);
  
      // Hide the points message after a short delay
      setTimeout(() => {
        setShowPointsMessage(false);
      }, 2000); // The message will disappear after 2 seconds
    } else {
        setProgress((prevProgress) => Math.min(prevProgress + 10, exercises.length * 10));
      setAnswerStatus("wrong");
    }
  
    setIsCheckMode(false); // Switch to continue mode
  };
  

  const handleContinue = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      const isCompleted = progress === exercises.length * 10;
      if (isCompleted) {
        setLeaf(leaf + progress);
      }

      localStorage.setItem(`${stepKey}_completed`, isCompleted ? 1 : 0);
      localStorage.setItem(`${stepKey}_progress`, 0);
      localStorage.setItem(`${stepKey}_exerciseIndex`, 0);

      setCurrentExerciseIndex(0);
      navigate("/dashboard", { state: { stepKey, isCompleted } });
    }

    setSelectedIndex(null);
    setAnswerStatus("");
    setIsCheckMode(true);
    setTranslatedWords([]);
  };

  const handleButtonClick = () => {
    if (isCheckMode) {
      handleCheck();
    } else {
      handleContinue();
    }
  };

  const handleProgressBarIconClick = () => {
    localStorage.setItem(`${stepKey}_progress`, progress);
    localStorage.setItem(`${stepKey}_exerciseIndex`, currentExerciseIndex);

    navigate("/dashboard");
  };

  const sentenceLanguage = checkLanguage(currentExercise.data?.englishSentence || "");

  return (
    <div className="main-content">
     
  
      <ProgressBar progress={progress} onIconClick={handleProgressBarIconClick} />
  
      <div className="exercise-counter" style={{ color: "#4caf50", fontWeight: "bold" }}>
        {`${currentExerciseIndex } / ${exercises.length}`}
      </div>
  
      {currentExercise.type === "MCQ" ? (
        <MCQ
          englishSentence={englishSentence}
          choices={shuffledChoices}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          sentenceLanguage={sentenceLanguage}
        />
      ) : currentExercise.type === "OrderExo" ? (
        <OrderExo
          englishSentence={englishSentence}
          correctArabicSentence={correctArabicSentence}
          setTranslatedWords={setTranslatedWords}
          translatedWords={translatedWords}
          sentenceLanguage={sentenceLanguage}
        />
      ) : (
        <div>No exercise available</div>
      )}
    {/* Points message */}
    {showPointsMessage && (
        <div className="points-message" style={{color:'green', fontSize:'40px'}}>
          {pointsMessage}
        </div>
      )}
      <BottomLearn
        isCheckMode={isCheckMode}
        onButtonClick={handleButtonClick}
        answerStatus={answerStatus}
      />
    </div>
  );
  
};

export default ExoPage;
