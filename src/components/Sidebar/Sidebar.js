import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Sidebar.css';
import Card from './Card';
import"../../colors.css";

const Sidebar = () => {
  const [selectedCard, setSelectedCard] = useState(null); // Tracks the selected card
  const navigate = useNavigate(); // React Router hook for navigation

  const handleCardClick = (index, route) => {
    setSelectedCard(index); 
    navigate(route); 
  };

  const cardData = [
    { imgSrc: `${process.env.PUBLIC_URL}/Pics/home1.png`, text: "Learn", route: "/dashboard" },
    { imgSrc: `${process.env.PUBLIC_URL}/Pics/translation.png`, text: "Translate", route: "/translate" },
    { imgSrc: `${process.env.PUBLIC_URL}/Pics/help.png`, text: "Help", route: "/help" },
    { imgSrc: `${process.env.PUBLIC_URL}/Pics/home2.png`, text: "Sign Out", route: "/signout" },
  ];

  return (
    <div className="Sidebar">
      <div className="Head">
        <img
          className="logo"
          src={`${process.env.PUBLIC_URL}/Pics/logo.png`}
          alt="Linguatree"
        />
        <div className="Linguatree">LinguaTree</div>
      </div>
      <div className="Cards">
        {cardData.map((card, index) => (
          <Card
            key={index}
            imgSrc={card.imgSrc}
            text={card.text}
            bgColor="white"
            shadow={selectedCard === index} // Highlight only the selected card
            onClick={() => handleCardClick(index, card.route)} // Pass the click handler
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
