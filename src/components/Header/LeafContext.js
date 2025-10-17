import React, { createContext, useContext, useState } from 'react';

// Create a Context for leaf
const LeafContext = createContext();

// Create a provider component to wrap around the application
export const LeafProvider = ({ children }) => {
  const [leaf, setLeaf] = useState(4); // Set default leaf value

  return (
    <LeafContext.Provider value={{ leaf, setLeaf }}>
      {children}
    </LeafContext.Provider>
  );
};

// Custom hook to use the leaf context
export const useLeaf = () => useContext(LeafContext);
