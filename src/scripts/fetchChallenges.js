export const fetchChallenges = async () => {
    try {
      const response = await fetch('http://localhost:8000/challenges/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
  
      return  data;
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return null;
    }
  };
  