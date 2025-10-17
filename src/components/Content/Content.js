import React, { useState, useEffect } from "react";
import "./Content.css";
import Unitcard from "../Unitcard/Unitcard";
import Step from "../Step/Step";
import "../../colors.css";
import { useNavigate } from "react-router-dom";
import units from "./units";
import { fetchData } from "../../scripts/fetchExercises";
import { fetchMissions } from "../../scripts/fetchMissions";

const Content = () => {
  const [activeUnitStep, setActiveUnitStep] = useState({ unitIndex: 0, stepIndex: 0 }); // Start at first step
  const [progress, setProgress] = useState(0); // Track progress
  const [exercisesData, setExercisesData] = useState(null); // State for exercises data
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const leaf=150; // Use leaf points
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // For notification message

  // Fetch and process exercises data
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true); // Start loading
      const result = await fetchData();
      setExercisesData(result);
      setIsLoading(false); // Stop loading
    };

    fetchExercises();
  }, []);
  const getRequiredPoints = (missionsByUnit, unitIndex, stepIndex) => {
    const mission = missionsByUnit[unitIndex]?.find((m) => m.order === stepIndex);
    return mission ? mission.points : null;
  };
  
  // Set active unit and step based on missions and leaf points
  useEffect(() => {
    const determineActiveStep = async () => {
      const missionsByUnit = await fetchMissions(); // Fetch and structure missions
      if (!missionsByUnit) return;
  
      let activeStepSet = false;
  
      for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
        const unit = units[unitIndex];
  
        for (let stepIndex = 0; stepIndex < unit.steps.length; stepIndex++) {
          const requiredPoints = getRequiredPoints(missionsByUnit, unitIndex, stepIndex); // Get required points for the step
  
          if (leaf < requiredPoints) {
            // If leaf is less than required points, set the previous step as active
            setActiveUnitStep({
              unitIndex,
              stepIndex: stepIndex > 0 ? stepIndex - 1 : 0,
            });
            activeStepSet = true;
            break;
          }
        }
  
        if (activeStepSet) break;
      }
  
      if (!activeStepSet) {
        // If all steps are accessible, set the last step as active
        const lastUnitIndex = units.length - 1;
        const lastStepIndex = units[lastUnitIndex].steps.length - 1;
  
        setActiveUnitStep({
          unitIndex: lastUnitIndex,
          stepIndex: lastStepIndex,
        });
      }
    };
  
    determineActiveStep();
  }, [leaf]);
  

  // Load progress from localStorage
  useEffect(() => {
    const storedProgress = localStorage.getItem("progress");
    if (storedProgress) {
      setProgress(Number(storedProgress));
    }
  }, []);

  const handleStepClick = (unitIndex, stepIndex, stepType) => {
    if (isLoading) {
      setNotification("Exercises are still loading. Please wait!");
      setTimeout(() => setNotification(null), 3000);
      return;
    }
  
    if (!exercisesData) {
      setNotification("No exercises data available.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }
  
    const isActive =
      unitIndex < activeUnitStep.unitIndex ||
      (unitIndex === activeUnitStep.unitIndex && stepIndex <= activeUnitStep.stepIndex);
  
    if (!isActive) {
      setNotification("You need to solve the exercises above before this step!");
      setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
      return;
    }
  
    const exercises = exercisesData[unitIndex]?.[stepIndex] || [];
  
    if (exercises.length > 0) {
      navigate("/exercise", { state: { exercises, unitIndex, stepIndex } });
    } else if (stepType === "image") {
      console.log("Image step clicked!");
    } else {
      setNotification("No valid exercises available for this step!");
      setTimeout(() => setNotification(null), 3000);
    }
  };
  

  const renderSteps = (steps, unitIndex) => {
    return steps.map((step, stepIndex) => {
      const stepKey = `${unitIndex}-${stepIndex}`;
      const isStepCompleted = localStorage.getItem(`${stepKey}_completed`) === "1";

      const isActive =
        unitIndex < activeUnitStep.unitIndex ||
        (unitIndex === activeUnitStep.unitIndex && stepIndex <= activeUnitStep.stepIndex);
      const stepInnerCircleColor = isStepCompleted
        ? "#00FF00"
        : isActive
        ? "#4caf50"
        : "#939A8D";

      const showProgressCircle =
        unitIndex === activeUnitStep.unitIndex && stepIndex === activeUnitStep.stepIndex;

      let stepImageSrc = step.src;
      if (isActive && step.type === "image") {
        if (step.src === "/Pics/Treasure.png") {
          stepImageSrc = "/Pics/Color_Treasure.png";
        } else if (step.src === "/Pics/Tree.png") {
          stepImageSrc = "/Pics/Color_Tree.png";
        }
      }

      return (
        <div
          key={stepIndex}
          className={`Step`}
          style={{
            left: showProgressCircle ? `calc(${step.left} - 10%)` : step.left,
            top: step.top,
          }}
          onClick={() => handleStepClick(unitIndex, stepIndex, step.type)}
        >
          {step.type === "image" ? (
            <img
              className="tree"
              src={process.env.PUBLIC_URL + stepImageSrc}
              alt={step.src.split("/").pop().split(".")[0]} // Accessibility: alt text from filename
            />
          ) : (
            <>
              {showProgressCircle && (
                <div
                  className="progress-circle"
                  style={{ position: "absolute", top: "50%", left: "50%" }}
                >
                  <Step
                    innerCircleColor={stepInnerCircleColor}
                    icon={step.icon}
                    progress={progress}
                  />
                </div>
              )}
              {!showProgressCircle && (
                <Step
                  innerCircleColor={stepInnerCircleColor}
                  icon={step.icon}
                  progress={step.progress}
                />
              )}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="Content">
      {notification && (
      <div className="notification-card">
        {notification}
      </div>
    )}
      {units.map((unit, unitIndex) => (
        <React.Fragment key={unitIndex}>
          <Unitcard unit={unit.unit} title={unit.title} />
          <div className={`progress-container${unitIndex + 1}`}>
            {renderSteps(unit.steps, unitIndex)}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Content;
