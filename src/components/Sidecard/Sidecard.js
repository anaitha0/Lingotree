import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidecard.css";
import "../../colors.css";

const SideCard = ({ icon, title, link }) => {
  const navigate = useNavigate(); // Hook to navigate to routes

  const handleClick = () => {
    if (link) {
      navigate(link); // Navigate to the provided route
    }
  };

  return (
    <div className="side-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="side-card-icon">
        <img src={icon} alt={`${title} icon`} />
      </div>
      <div className="side-card-title">{title}</div>
    </div>
  );
};

export default SideCard;
