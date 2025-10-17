import React from "react";
import "./WordOrder.css";
import"../../assests/fonts.css"
function WordOrder({
  englishSentence,
  arabicSentence,
  translatedWords,
  setTranslatedWords,
  sentenceLanguage
}) {
  const handleWordClick = (word) => {
    let updatedWords;

    if (translatedWords.includes(word)) {
      updatedWords = translatedWords.filter((w) => w !== word);
    } else {
      updatedWords = [...translatedWords, word];
    }

    console.log(updatedWords); // Debugging: log the updated word array
    setTranslatedWords(updatedWords); // Send updated words back to the parent
  };

  return (
    <div className="word-order-container">
      {/* Display the English sentence */}
      <div className="english-sentence">
        <h3 style={{ color: "#2d3a3f" }}>{sentenceLanguage === "English"
            ? "English Sentence:"
            : "جملة عربية"}</h3>
        <p style={{ color: "#2d3a3f" }}>{englishSentence}</p>
      </div>

      {/* Arabic Sentence Card (User's translated sentence) */}
      <div className="translated-sentence">
        <h3 style={{ color: "#2d3a3f" }}>{sentenceLanguage === "English"
            ? "Translate the Sentence:"
            : "ترجم الجملة"}</h3>
        <div className="translated-card" style={{ direction: sentenceLanguage === "English" ? "rtl" : "ltr" }}>
          {translatedWords.map((word) => (
            <span key={word} className="word-card selected" style={{ color: "#2d3a3f" }}>
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Available Arabic Words (Word Cards) */}
      <div className="word-cards">
  <h3 style={{ color: "#2d3a3f" }}>
    {sentenceLanguage === "English" ? "Arabic Words:" : "كلمات إنجليزية"}
  </h3>
  <div
    className="word-cards-container"
    style={{ direction: sentenceLanguage === "rtl" }}
  >
    {arabicSentence.map((word, index) => (
      <div
        key={index}
        className={`word-card ${translatedWords.includes(word) ? "selected" : ""}`}
        onClick={() => handleWordClick(word)}
      >
        {word}
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default WordOrder;
