import { fetchData } from './fetchExercises.js';

const fetchAndLogData = async () => {
  const data = await fetchData();
  if (data) {
    console.log("Structured Data:", data);
    console.log("Accessed exercise 1 data:", data[0][0][1].data);
  }
};

fetchAndLogData();
