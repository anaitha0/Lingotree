const fetchAndProcessExercises = async () => {
    try {
      // Fetch data from the API
      const response = await fetch("http://127.0.0.1:8000/exercises/");
      const data = await response.json();
      
      // Step 1: Filter by English sentences only
      const isEnglish = (text) => /^[\x00-\x7F]+$/.test(text);
      const mcqEnglish = data.multiple_choice.filter(ex => isEnglish(ex.sentence));
      const reorderEnglish = data.reorder_translation.filter(ex => isEnglish(ex.sentence));
  
      // Step 2: Transform fields
      const transformMCQ = (ex) => ({
        englishSentence: ex.sentence,
        correctArabicSentence: ex.correct_translation,
        choices: ex.choices,
      });
  
      const transformReorder = (ex) => ({
        englishSentence: ex.sentence,
        correctArabicSentence: ex.pieces.join(" "),
      });
  
      const mcqTransformed = mcqEnglish.map(transformMCQ);
      const reorderTransformed = reorderEnglish.map(transformReorder);
  
      // Step 3: Assign units and steps
      const assignToUnit = (level, mcq, reorder) => {
        const unit = [];
        for (let i = 0; i < 3; i++) {
          // Randomly select 5 MCQs and 5 reorder exercises for each step
          const stepMCQ = mcq.sort(() => 0.5 - Math.random()).slice(0, 5);
          const stepReorder = reorder.sort(() => 0.5 - Math.random()).slice(0, 5);
          unit.push([...stepMCQ, ...stepReorder]);
        }
        return unit;
      };
  
      // Unit mapping
      const unit0 = assignToUnit(0, mcqTransformed, reorderTransformed);
      const unit1 = assignToUnit(1, mcqTransformed, reorderTransformed);
      const unit2 = assignToUnit(2, mcqTransformed, reorderTransformed);
  
      // Final structure
      const exercisesData = { unit0, unit1, unit2 };
  
      // Output the structured data
      console.log(JSON.stringify(exercisesData, null, 4));
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
  };
  
  // Call the function
  fetchAndProcessExercises();
  