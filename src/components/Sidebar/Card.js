import React from "react";
import "./Card.css";
import"../../colors.css";
import "../../assests/fonts.css"
const Card = ({ imgSrc, text, bgColor = "white", shadow = false, onClick }) => {
  const cardStyle = {
    backgroundColor: shadow ? "#E7EAF4" : bgColor,
    boxShadow: shadow ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div className="Card" style={cardStyle} onClick={onClick}>
      <img className="pic" src={imgSrc} alt={text} />
      <div className="CardText" >{text}</div>
    </div>
  );
};

export default Card;
