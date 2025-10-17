import React from "react";
import "./TranslationPart.css";
import"../../colors.css";

const TranslationPart = ({ text, Textgiven, correctText, onTextChange }) => {
  

  return (
    <div className="translation-part">
     
        <>
        
          <div className="text-box input-box">
            <textarea
              placeholder="Enter text here..."
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
            />
          </div>
          <div className="text-box output-box">
            <div className="translated-text" >{Textgiven || "Diversifying your investments across different sectors can help reduce the overall risk and protect your financial future. By spreading assets across industries like technology, healthcare, and real estate, you minimize the impact of market volatility."}</div>
          </div>
        </>
      
    </div>
  );
};

export default TranslationPart;
