import React, { useState, useEffect, useRef } from "react";
import "./OrderExo.css";
import "../../colors.css";
import WordOrder from "../../components/WordOrder/WordOrder";
import "../../assests/fonts.css"
function OrderExo({ correctArabicSentence, englishSentence, setTranslatedWords, translatedWords,sentenceLanguage }) {
  // State to track randomized Arabic sentence
  const [randomizedArabicSentence, setRandomizedArabicSentence] = useState([]);

  // Reference to track previous correctArabicSentence value
  const prevCorrectArabicSentence = useRef();

  useEffect(() => {
    
    // Only update the randomized sentence if correctArabicSentence has changed
    if (
      correctArabicSentence &&
      correctArabicSentence.length > 0 &&
      (prevCorrectArabicSentence.current !== correctArabicSentence.join(","))
    ) {
      // Shuffling Arabic sentence
      const shuffledArabicSentence = [...correctArabicSentence].sort(() => Math.random() - 0.5);
      setRandomizedArabicSentence(shuffledArabicSentence);
      prevCorrectArabicSentence.current = correctArabicSentence.join(","); // Update the reference
    }
  }, [correctArabicSentence]); // Depend on correctArabicSentence only

  return (
    <div className="order-exercise">
      <div className="question">
        <h2 className="title" style={{ color: "#2d3a3f" }}>
        {sentenceLanguage === "English"
            ? "Order the Arabic translation:"
            : " رتب الجملة الانجليزية"}
        </h2>
      </div>

      <WordOrder
        englishSentence={englishSentence}
        arabicSentence={randomizedArabicSentence} // Passing the (shuffled) arabicSentence
        setTranslatedWords={setTranslatedWords}
        translatedWords={translatedWords} 
        sentenceLanguage={sentenceLanguage}// Passing translatedWords as a prop
      />
    </div>
  );
}

export default OrderExo;
