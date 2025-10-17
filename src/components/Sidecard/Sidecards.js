import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideCard from "./Sidecard";
import "./Sidecards.css";
import "../../colors.css";
import { fetchChallenges } from "../../scripts/fetchChallenges";
import "../../assests/fonts.css"
const SideCards = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const selectedLevel = "Beginner";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChallenges();
        if (data) {
          setChallenges(data);
          setLoading(false);
          console.log("Fetched challenges:", data);

          // Wait for challenge selection to complete
          await selectChallengeBasedOnLevel(data);
          console.log("Final selected challenge:", selectedChallenge);
        }
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to filter and select a challenge based on the level
  const selectChallengeBasedOnLevel = async (challenges) => {
    return new Promise((resolve) => {
      const filteredChallenges = challenges.filter(
        (challenge) => challenge["difficulty_level"] === selectedLevel
      );

      console.log("Filtered challenges based on level:", filteredChallenges);

      if (filteredChallenges.length > 0) {
        const randomChallenge =
          filteredChallenges[
            Math.floor(Math.random() * filteredChallenges.length)
          ];
        console.log("Pre-selected challenge:", randomChallenge);

        // Set the selected challenge
        setSelectedChallenge(randomChallenge);

        // Resolve once the state is updated
        resolve(randomChallenge);
      } else {
        console.log("No challenges found for this level");
        resolve(null);
      }
    });
  };

  // Handle navigation when user clicks "Start Challenge"
  const handleStartChallenge = () => {
    if (selectedChallenge) {
      console.log("Navigating to challenge with:", selectedChallenge);
      navigate("/challenges", {
        state: {
          paragraph: selectedChallenge.paragraph || "No paragraph available",
          correct_translation:
            selectedChallenge.correct_translation || "No translation available",
          points: selectedChallenge.points || 0,
          timer_seconds: selectedChallenge.timer_seconds || 0,
          source_language: selectedChallenge.source_language || "Unknown",
        },
      });
    } else {
      console.error("No challenge selected yet.");
    }
  };

  const cards = [
    {
      icon: `${process.env.PUBLIC_URL}/Pics/lessons.png`,
      title: "Lessons",
      link: "/learn",
    },
    {
      icon: `${process.env.PUBLIC_URL}/Pics/questions.png`,
      title: "Questions",
      link: "/translate",
    },
    {
      icon: `${process.env.PUBLIC_URL}/Pics/challenges.png`,
      title: "Challenges",
      link: "/Challenges",
    },
  ];

  const links = ["About", "News", "Help", "Contact"];

  return (
    <div className="side-cards">
  <div className="cards-container">
    {cards.map((card, index) => {
      if (card.title === "Challenges") {
        // Render the "Challenges" card with onClick and disabled logic
        return (
          <div
            key={index}
            className={`side-card ${!selectedChallenge ? "disabled" : ""}`} // Add a disabled class conditionally
            onClick={selectedChallenge ? handleStartChallenge : null} // Only allow click if selectedChallenge exists
            style={{
              cursor: selectedChallenge ? "pointer" : "not-allowed", // Update cursor style
              opacity: selectedChallenge ? 1 : 0.5, // Dim the card if disabled
            }}
          >
            <img className='side-card-icon  ' src={card.icon} alt={`${card.title} icon`} />
            <h3 className="side-card-title">{card.title}</h3>
          </div>
        );
      }

      // Render other cards normally
      return (
        <SideCard
          key={index}
          icon={card.icon}
          title={card.title}
          link={card.link}
        />
      );
    })}
  </div>

  <div className="links-container">
    {links.map((link, index) => (
      <a key={index} href={`#${link.toLowerCase()}`} className="side-link">
        {link}
      </a>
    ))}
  </div>

  {loading && <p>Loading challenges...</p>}

  

  
</div>


  );
};

export default SideCards;
