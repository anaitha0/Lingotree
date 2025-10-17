import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Learn from "./Pages/Learn/Learn";
import Translate from "./Pages/Translate/Translate";
import Challenges from "./Pages/Challenges/Challenges";
import Layout from "./components/Layout/Layout";
import ExoPage from "./Pages/ExoPage/ExoPage"; // The new centralized exercise page
import MCQ from "./Pages/MCQ/MCQ";
import OrderExo from "./Pages/OrderExo/OrderExo";
import { LeafProvider } from "../src/components/Header/LeafContext"; // Import the LeafProvider

function App() {
  return (
    // Wrap your whole app in LeafProvider to provide the leaf context globally
    <LeafProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/Challenges" element={<Challenges />} />
            {/* Centralized ExoPage Route */}
            <Route path="/exercise" element={<ExoPage />} />
            
          </Route>
        </Routes>
      </Router>
    </LeafProvider>
  );
}

export default App;
