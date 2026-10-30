import React, { createContext, useContext } from 'react';
import { useFactory } from './FactoryContext';

const MachineContext = createContext(null);

export const useMachine = () => {
  const context = useContext(MachineContext);
  const factory = useFactory();
  if (context) return context;
  return {
    machines: factory.machines,
    setMachines: factory.setMachines,
    addMachine: factory.addMachine,
    updateMachine: factory.updateMachine,
    deleteMachine: factory.deleteMachine
  };
};

export const MachineProvider = ({ children }) => {
  const factory = useFactory();
  const value = {
    machines: factory.machines,
    setMachines: factory.setMachines,
    addMachine: factory.addMachine,
    updateMachine: factory.updateMachine,
    deleteMachine: factory.deleteMachine
  };
  return (
    <MachineContext.Provider value={value}>
      {children}
    </MachineContext.Provider>
  );
};

export default MachineContext;
