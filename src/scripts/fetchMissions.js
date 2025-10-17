export const fetchMissions = async () => {
    try {
      const response = await fetch('http://localhost:8000/missions/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log("Fetched missions:", data);
  
      // Map levels to units
      const levelToUnit = {
        Beginner: 0,
        Intermediate: 1,
        Advanced: 2,
      };
  
      // Structure the missions by unit
      const missionsByUnit = {
        0: [], // Beginner
        1: [], // Intermediate
        2: [], // Advanced
      };
  
      data.forEach((mission) => {
        const missionUnit = levelToUnit[mission.level];
        if (missionUnit !== undefined) {
          missionsByUnit[missionUnit].push({
            order: mission.order,
            points: mission.required_points,
          });
        }
      });
  
      console.log("Structured missions by unit:", missionsByUnit);
      return missionsByUnit;
    } catch (error) {
      console.error("Error fetching missions:", error);
      return null;
    }
  };
  