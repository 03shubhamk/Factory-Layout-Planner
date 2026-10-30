import React, { createContext, useContext } from 'react';
import { useFactory } from './FactoryContext';

const LayoutContext = createContext(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  const factory = useFactory();
  if (context) return context;
  return {
    metrics: factory.metrics,
    suggestions: factory.suggestions,
    reports: factory.reports || [],
    applySuggestion: factory.applySuggestion,
    saveReport: factory.saveReport
  };
};

export const LayoutProvider = ({ children }) => {
  const factory = useFactory();
  const value = {
    metrics: factory.metrics,
    suggestions: factory.suggestions,
    reports: factory.reports || [],
    applySuggestion: factory.applySuggestion,
    saveReport: factory.saveReport
  };
  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
