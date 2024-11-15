import React, { createContext, useContext, useState } from "react";

// Create Context
const ProfitLossContext = createContext();

// Provide Context
export const ProfitLossProvider = ({ children }) => {
  const [profitOrLoss, setProfitOrLoss] = useState(0);

  return (
    <ProfitLossContext.Provider value={{ profitOrLoss, setProfitOrLoss }}>
      {children}
    </ProfitLossContext.Provider>
  );
};

// Custom hook to use ProfitLossContext
export const useProfitLoss = () => {
  return useContext(ProfitLossContext);
};
