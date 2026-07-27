import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { ArrowRight, Plus, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ProductionFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeFactory, machines, flow, loadFactoryDetails, saveFlow } = useFactory();
  
  // Local list of step machine IDs
  const [localSteps, setLocalSteps] = useState([]);

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  // Sync local steps from context flow when loaded
  useEffect(() => {
    if (flow && flow.length > 0) {
      setLocalSteps(flow.map(f => f.machineId));
    } else if (machines && machines.length > 0 && localSteps.length === 0) {
      // Pre-fill with all placed machines in their natural list order as a helper
      setLocalSteps(machines.map(m => m.id));
    }
  }, [flow, machines]);

  const handleStepChange = (index, machineId) => {
    setLocalSteps(prev => {
      const copy = [...prev];
      copy[index] = machineId;
      return copy;
    });
  };

  const handleAddStep = () => {
    if (machines.length === 0) return;
    // Add the first machine as a default template step
    setLocalSteps(prev => [...prev, machines[0].id]);
  };

  const handleRemoveStep = (index) => {
    setLocalSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (localSteps.length < 2) {
      alert('Production flow requires at least 2 steps for material routing analysis.');
      return;
    }
    
    await saveFlow(localSteps);
    navigate(`/analysis/${activeFactory.id}`);
  };

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Define Production Flow</h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify the sequence of machine processing steps. Material travel distances will be calculated in this order.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/designer/${activeFactory.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-sm shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Designer
          </button>
          <button
            onClick={handleContinue}
            disabled={localSteps.length < 2}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-bold text-sm shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flow Editor Area */}
      <div className="max-w-3xl mx-auto bg-white rounded-custom border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Production Steps</h2>
          <button
            onClick={handleAddStep}
            disabled={machines.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-primary hover:bg-blue-100 transition-all rounded text-xs font-bold border border-blue-100 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Step
          </button>
        </div>

        {machines.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-warning flex items-center justify-center mx-auto border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 text-sm">No machines placed on floor grid</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Go back to the Layout Designer to drag and drop machinery nodes before arranging your flow.
              </p>
            </div>
            <button
              onClick={() => navigate(`/designer/${activeFactory.id}`)}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              Open Layout Designer
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {localSteps.map((selectedMachId, index) => {
              const selectedMachObj = machines.find(m => m.id === selectedMachId);

              return (
                <div key={index} className="flex items-center gap-4 group">
                  {/* Step counter tag */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200">
                    {index + 1}
                  </div>

                  {/* Dropdown select */}
                  <div className="flex-1">
                    <select
                      value={selectedMachId}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      {machines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.machineName} ({m.machineType}) - Pos: ({m.x}m, {m.y}m)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step status descriptor banner (derived) */}
                  {selectedMachObj && (
                    <div className="text-[10px] font-mono text-slate-400 font-bold hidden sm:block">
                      {selectedMachObj.machineType.toUpperCase()}
                    </div>
                  )}

                  {/* Delete Step Button */}
                  <button
                    onClick={() => handleRemoveStep(index)}
                    className="p-2 text-slate-400 hover:text-danger hover:bg-rose-50 rounded transition-all shrink-0"
                    title="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {localSteps.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No steps defined. Click "+ Add Step" to initialize your process mapping.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress sequence connector timeline preview */}
      {localSteps.length >= 2 && (
        <div className="max-w-3xl mx-auto bg-slate-900 rounded-custom p-6 shadow-premium text-white space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flow Sequence Timeline</h3>
          <div className="flex flex-wrap items-center gap-2 py-2">
            {localSteps.map((machId, idx) => {
              const m = machines.find(mac => mac.id === machId);
              if (!m) return null;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-600 font-bold text-sm">→</span>}
                  <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono font-semibold flex items-center gap-1.5">
                    <span>
                      {m.machineType === 'Input' ? '📦' :
                       m.machineType === 'Processing' ? '⚙️' :
                       m.machineType === 'Assembly' ? '🤝' :
                       m.machineType === 'Logistics' ? '🗳️' : '🔍'}
                    </span>
                    <span>{m.machineName}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
