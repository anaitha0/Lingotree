export const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/exercises/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
  
      // Define structure for storing exercises per unit and step
      const structuredData = {
        0: { 0: [], 1: [], 3: [], 4: [] }, // Beginner
        1: { 0: [], 1: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, // Intermediate
        2: { 0: [], 1: [], 3: [], 4: [], 5: [], 7: [], 8: [], 9: [], 10: [] }, // Advanced
      };
  
      const levelToUnit = {
        Beginner: 0,
        Intermediate: 1,
        Advanced: 2,
      };
  
      const typeMapping = {
        multiple_choice: "MCQ",
        reorder_translation: "OrderExo",
      };
  
      // Global pool for all unused exercises per type
      const unusedExercises = {
        MCQ: [],
        OrderExo: [],
      };
  
      // Function to prepare the unused exercises pool
      function prepareUnusedExercises(data) {
        Object.keys(data).forEach((exerciseType) => {
          if (!typeMapping[exerciseType]) return;
  
          const exercises = data[exerciseType].filter(
            (exercise) =>
              levelToUnit[exercise.level] !== undefined
          );
  
          exercises.forEach((exercise) => {
            const type = typeMapping[exerciseType];
            unusedExercises[type].push({
              ...exercise,
              unit: levelToUnit[exercise.level],
            });
          });
        });
      }
  
      // Function to assign exercises to a step without repetition
      function assignExercisesToStep(stepData, type, count, unit) {
        const selectedExercises = [];
        for (let i = 0; i < count && unusedExercises[type].length > 0; i++) {
          const index = unusedExercises[type].findIndex((ex) => ex.unit === unit);
          if (index >= 0) {
            const [exercise] = unusedExercises[type].splice(index, 1);
            selectedExercises.push({
              type,
              component: type,
              data: {
                id: exercise.id, // Add the id here
                englishSentence: exercise.sentence,
                correctArabicSentence: exercise.correct_translation.split(" "),
                points: exercise.points, // Add points here
                ...(exercise.choices && {
                  choices: exercise.choices.map(choice => {
                    if (typeof choice === 'string') {
                      return choice.split(" ");  // Split only if it's a string
                    } else {
                      return choice;  // Otherwise keep the original choice
                    }
                  }),
                }),
              },
            });
          }
        }
        stepData.push(...selectedExercises);
      }
  
      // Main function to distribute exercises across steps
      function distributeExercises() {
        Object.entries(structuredData).forEach(([unit, steps]) => {
          Object.keys(steps).forEach((stepKey) => {
            const stepData = steps[stepKey];
  
            // Assign exactly 5 MCQs and 5 OrderExos
            assignExercisesToStep(stepData, "MCQ", 5, parseInt(unit));
            assignExercisesToStep(stepData, "OrderExo", 5, parseInt(unit));
          });
        });
      }
  
      // Prepare the unused exercises pool
      prepareUnusedExercises(data);
  
      // Distribute exercises across the steps
      distributeExercises();
  
      return structuredData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
  