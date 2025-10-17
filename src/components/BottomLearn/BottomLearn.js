import React from "react";
import "./BottomLearn.css";
import "../../colors.css";

function BottomLearn({ isCheckMode, onButtonClick, answerStatus }) {
  return (
    <div
      className={`bottom ${
        answerStatus === "excellent"
          ? "bottom-excellent"
          : answerStatus === "wrong"
          ? "bottom-wrong"
          : ""
      }`}
    >
      <div className="bottom-right">
        {answerStatus && (
          <span>
            {answerStatus === "excellent" ? (
              <>
                <span className="icon icon-excellent">✅</span>
                <span style={{ color: 'green' }}>Excellent!</span>
              </>
            ) : (
              <>
                <span className="icon">❌</span>
                <span style={{ color: 'red' }}>Wrong Answer!</span>
              </>
            )}
          </span>
        )}
      </div>
      <div className="bottom-left">
        <button
          className={`button ${
            answerStatus === "excellent"
              ? "button-excellent"
              : answerStatus === "wrong"
              ? "button-wrong"
              : ""
          }`}
          onClick={onButtonClick}
        >
          {isCheckMode ? "Check" : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default BottomLearn;
