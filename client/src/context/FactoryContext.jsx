import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { calculateLayoutMetrics } from '../utils/calculations';
import { generateSuggestions } from '../utils/suggestionEngine';
import { toast } from 'react-toastify';

const FactoryContext = createContext();

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};

export const FactoryProvider = ({ children }) => {
  const [factories, setFactories] = useState([]);
  const [activeFactory, setActiveFactory] = useState(null);
  const [machines, setMachines] = useState([]);
  const [flow, setFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all factories for dashboard
  const loadFactories = async () => {
    setLoading(true);
    try {
      const data = await api.getFactories();
      setFactories(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load projects.');
      toast.error('Failed to retrieve factories dashboard.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch details of a single factory
  const loadFactoryDetails = async (id) => {
    setLoading(true);
    try {
      const data = await api.getFactory(id);
      setActiveFactory({
        id: data.id,
        name: data.name,
        length: data.length,
        width: data.width,
        departmentCount: data.departmentCount,
        description: data.description,
        createdAt: data.createdAt
      });
      setMachines(data.machines || []);
      
      // Map database productionFlow to simple sequence
      const sortedFlow = data.productionFlow || [];
      setFlow(sortedFlow);
      setError(null);
      return data;
    } catch (err) {
      console.error(err);
      setError('Failed to load factory details.');
      toast.error('Could not load factory layout.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new factory
  const createNewFactory = async (factoryData) => {
    setLoading(true);
    try {
      const newFactory = await api.createFactory(factoryData);
      setFactories(prev => [newFactory, ...prev]);
      toast.success(`Factory "${newFactory.name}" initialized successfully!`);
      setError(null);
      return newFactory;
    } catch (err) {
      console.error(err);
      setError('Failed to create factory.');
      toast.error('Error initializing factory layout.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete factory
  const deleteFactory = async (id) => {
    try {
      await api.deleteFactory(id);
      setFactories(prev => prev.filter(f => f.id !== id));
      if (activeFactory && activeFactory.id === id) {
        setActiveFactory(null);
        setMachines([]);
        setFlow([]);
      }
      toast.success('Factory layout removed.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete factory.');
    }
  };

  // Add machine to active factory
  const addMachine = async (machineData) => {
    if (!activeFactory) return;
    try {
      const newMach = await api.addMachine(activeFactory.id, machineData);
      setMachines(prev => [...prev, newMach]);
      toast.success(`Added machine "${newMach.machineName}"`);
      return newMach;
    } catch (err) {
      console.error(err);
      toast.error('Failed to add machine.');
    }
  };

  // Update machine position or properties
  const updateMachine = async (machineId, updatedFields) => {
    if (!activeFactory) return;
    
    // Optimistic local update for smooth dragging animations
    setMachines(prev => prev.map(m => m.id === machineId ? { ...m, ...updatedFields } : m));

    try {
      await api.updateMachine(activeFactory.id, machineId, updatedFields);
    } catch (err) {
      console.error(err);
      // Rollback or show error
      toast.error('Failed to save machine positions on server.');
    }
  };

  // Delete machine
  const deleteMachine = async (machineId) => {
    if (!activeFactory) return;
    try {
      await api.deleteMachine(activeFactory.id, machineId);
      setMachines(prev => prev.filter(m => m.id !== machineId));
      setFlow(prev => prev.filter(step => step.machineId !== machineId));
      toast.success('Machine removed from layout.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove machine.');
    }
  };

  // Save production flow order
  const saveFlow = async (machineIdsSequence) => {
    if (!activeFactory) return;
    setLoading(true);
    try {
      const updatedFlow = await api.saveProductionFlow(activeFactory.id, machineIdsSequence);
      setFlow(updatedFlow);
      toast.success('Production flow sequence updated.');
      setError(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save production sequence.');
    } finally {
      setLoading(false);
    }
  };

  // Save report
  const saveReport = async (reportData) => {
    if (!activeFactory) return;
    try {
      const r = await api.saveReport(activeFactory.id, reportData);
      // Reload factories to update latest report cache
      loadFactories();
      return r;
    } catch (err) {
      console.error(err);
      toast.error('Failed to archive layout report.');
    }
  };

  // Derived layout calculations and metrics
  const metrics = useMemo(() => {
    return calculateLayoutMetrics(machines, flow);
  }, [machines, flow]);

  // Derived suggestions from layout geometry
  const suggestions = useMemo(() => {
    if (!activeFactory) return [];
    return generateSuggestions(machines, flow, activeFactory.length, activeFactory.width);
  }, [machines, flow, activeFactory]);

  // Apply layout suggestion (moves the target machine to optimized coordinates)
  const applySuggestion = async (suggestion) => {
    if (!activeFactory || !suggestion.targetMachineId || !suggestion.suggestedCoords) return;
    
    const { targetMachineId, suggestedCoords } = suggestion;
    
    // Update local state
    setMachines(prev => prev.map(m => m.id === targetMachineId ? { ...m, ...suggestedCoords } : m));
    
    try {
      // Sync with server
      await api.updateMachine(activeFactory.id, targetMachineId, suggestedCoords);
      toast.success(`Relocated machine according to suggestion: Saved ${suggestion.estimatedSaving}m!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync suggestion coordinates to server.');
    }
  };

  // Global dashboard statistics
  const dashboardStats = useMemo(() => {
    if (factories.length === 0) {
      return { totalProjects: 0, avgEfficiency: 0, bestLayout: 'None', lastUpdated: 'Never' };
    }

    const projectsWithReports = factories.filter(f => f.reports && f.reports.length > 0);
    const avgEff = projectsWithReports.length > 0
      ? Math.round(projectsWithReports.reduce((acc, f) => acc + f.reports[0].efficiency, 0) / projectsWithReports.length)
      : 80; // default initial fallback

    let bestName = 'None';
    let bestScore = -1;
    projectsWithReports.forEach(f => {
      if (f.reports[0].efficiency > bestScore) {
        bestScore = f.reports[0].efficiency;
        bestName = f.name;
      }
    });

    const lastUpdatedDate = factories.length > 0 
      ? new Date(factories.reduce((max, f) => f.createdAt > max ? f.createdAt : max, factories[0].createdAt))
      : null;

    const formattedTime = lastUpdatedDate 
      ? lastUpdatedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Never';

    return {
      totalProjects: factories.length,
      avgEfficiency: avgEff,
      bestLayout: bestName,
      lastUpdated: formattedTime
    };
  }, [factories]);

  // Sync dashboard factory list on start
  useEffect(() => {
    loadFactories();
  }, []);

  return (
    <FactoryContext.Provider value={{
      factories,
      activeFactory,
      machines,
      flow,
      loading,
      error,
      metrics,
      suggestions,
      dashboardStats,
      loadFactories,
      loadFactoryDetails,
      createNewFactory,
      deleteFactory,
      addMachine,
      updateMachine,
      deleteMachine,
      saveFlow,
      saveReport,
      applySuggestion
    }}>
      {children}
    </FactoryContext.Provider>
  );
};
export default FactoryContext;
