import React, { createContext, useContext } from 'react';
import { useFactory } from './FactoryContext';

const FlowContext = createContext(null);

export const useFlow = () => {
  const context = useContext(FlowContext);
  const factory = useFactory();
  if (context) return context;
  return {
    flow: factory.flow,
    setFlow: factory.setFlow,
    saveFlow: factory.saveFlow
  };
};

export const FlowProvider = ({ children }) => {
  const factory = useFactory();
  const value = {
    flow: factory.flow,
    setFlow: factory.setFlow,
    saveFlow: factory.saveFlow
  };
  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
};

export default FlowContext;
