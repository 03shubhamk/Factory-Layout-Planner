import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { Info, AlertTriangle, ArrowLeft, Sparkles, Check } from 'lucide-react';
import PRESET_TEMPLATES from '../utils/presetTemplates';

export default function CreateFactory() {
  const navigate = useNavigate();
  const { createNewFactory, loadFactoryDetails, addMachine, saveFlow } = useFactory();

  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    length: '100',
    width: '60',
    departmentCount: 4,
    description: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeptChange = (amount) => {
    setFormData(prev => ({
      ...prev,
      departmentCount: Math.max(1, Math.min(16, prev.departmentCount + amount))
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Factory name is required';
    }
    
    const lengthNum = parseFloat(formData.length);
    if (isNaN(lengthNum) || lengthNum <= 0) {
      errors.length = 'Length must be a positive number';
    } else if (lengthNum > 500) {
      errors.length = 'Length is too large (max 500m)';
    }

    const widthNum = parseFloat(formData.width);
    if (isNaN(widthNum) || widthNum <= 0) {
      errors.width = 'Width must be a positive number';
    } else if (widthNum > 500) {
      errors.width = 'Width is too large (max 500m)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectPreset = (tmpl) => {
    if (selectedPresetId === tmpl.id) {
      setSelectedPresetId(null);
      return;
    }
    setSelectedPresetId(tmpl.id);
    setFormData({
      name: tmpl.name,
      length: String(tmpl.defaultDimensions.length),
      width: String(tmpl.defaultDimensions.width),
      departmentCount: tmpl.defaultDimensions.departmentCount,
      description: tmpl.description
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const created = await createNewFactory({
        name: formData.name,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        departmentCount: parseInt(formData.departmentCount),
        description: formData.description
      });
      
      // Load details of the created factory to establish context
      await loadFactoryDetails(created.id);
      
      // If preset template was selected, populate machines and flow
      if (selectedPresetId) {
        const tmpl = PRESET_TEMPLATES.find(t => t.id === selectedPresetId);
        if (tmpl) {
          const createdIds = [];
          for (const mDef of tmpl.machines) {
            const newM = await addMachine({
              machineName: mDef.machineName,
              machineType: mDef.machineType,
              x: mDef.x,
              y: mDef.y,
              orientation: mDef.orientation,
              status: mDef.status,
              throughput: mDef.throughput,
              health: mDef.health,
              load: mDef.load
            });
            if (newM && newM.id) {
              createdIds.push(newM.id);
            }
          }
          if (createdIds.length > 0) {
            await saveFlow(createdIds);
          }
        }
      }

      // Redirect to the newly initialized layout designer
      navigate(`/designer/${created.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Compute stats on the fly
  const lengthVal = parseFloat(formData.length) || 0;
  const widthVal = parseFloat(formData.width) || 0;
  const totalNodes = Math.round(lengthVal * widthVal * 2); // 2 nodes per sq meter matches 12,000 for 100x60
  const aspect = widthVal > 0 ? (lengthVal / widthVal) : 0;
  const isAspectRatioExtreme = aspect > 5 || aspect < 0.2;

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col">
      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-custom border border-slate-200 shadow-soft p-8 space-y-6">
          {/* Preset Industry Template Quick Selector */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Start from Industry Preset (Optional)</span>
              </span>
              {selectedPresetId && (
                <button
                  type="button"
                  onClick={() => setSelectedPresetId(null)}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-700 underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_TEMPLATES.map((tmpl) => {
                const isSelected = selectedPresetId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectPreset(tmpl)}
                    className={`p-3 rounded-lg border text-left transition-all relative flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <span className="text-2xl">{tmpl.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{tmpl.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{tmpl.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Factory Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Factory Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., North Assembly Line 04"
                className={`w-full bg-slate-50 border ${
                  validationErrors.name ? 'border-danger' : 'border-slate-200'
                } rounded-lg px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition-all text-slate-800`}
              />
              {validationErrors.name && (
                <span className="text-xs text-danger mt-1 block">{validationErrors.name}</span>
              )}
            </div>

            {/* Length and Width Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Length */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Factory Length (Meters)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 border ${
                      validationErrors.length ? 'border-danger' : 'border-slate-200'
                    } rounded-lg pl-4 pr-10 py-3 text-sm outline-none focus:border-primary focus:bg-white transition-all text-slate-800 font-mono`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono">
                    m
                  </span>
                </div>
                {validationErrors.length && (
                  <span className="text-xs text-danger mt-1 block">{validationErrors.length}</span>
                )}
              </div>

              {/* Width */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Factory Width (Meters)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-50 border ${
                      validationErrors.width ? 'border-danger' : 'border-slate-200'
                    } rounded-lg pl-4 pr-10 py-3 text-sm outline-none focus:border-primary focus:bg-white transition-all text-slate-800 font-mono`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono">
                    m
                  </span>
                </div>
                {validationErrors.width && (
                  <span className="text-xs text-danger mt-1 block">{validationErrors.width}</span>
                )}
              </div>
            </div>

            {/* Departments Counter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Number of Departments
              </label>
              <div className="flex items-center gap-4">
                <div className="flex border border-slate-200 rounded-lg overflow-hidden h-12">
                  <button
                    type="button"
                    onClick={() => handleDeptChange(-1)}
                    className="w-12 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 transition-colors border-r border-slate-200"
                  >
                    —
                  </button>
                  <div className="w-16 flex items-center justify-center font-mono font-bold text-slate-800">
                    {formData.departmentCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeptChange(1)}
                    className="w-12 bg-slate-50 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 transition-colors border-l border-slate-200"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400 italic">
                  Recommended: 2 - 8
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Brief overview of production goals, constraints, or key machinery..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition-all text-slate-800 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold text-sm shadow-soft"
              >
                Initialize Layout
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Technical Sidebar Spec Panels */}
        <div className="space-y-6">
          {/* Tech Specs Panel */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-soft p-6 space-y-6">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Technical Specifications
            </h2>

            {/* Grid Calc */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">Grid Calculation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The layout engine uses a dynamic 0.5m grid based on your defined length and width.
              </p>
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs font-mono font-semibold text-blue-700">
                Total Nodes: {totalNodes.toLocaleString()}
              </div>
            </div>

            {/* Aspect Warning */}
            {isAspectRatioExtreme && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Aspect Ratio Warning
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extreme aspect ratios (&gt;5:1) may affect layout constraints, travel efficiency calculations, and grid alignment accuracy.
                </p>
              </div>
            )}

            {/* Blueprint preview box */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-800 text-sm">Blueprint Preview</h3>
              <div className="h-32 border border-slate-200 rounded-lg blueprint-grid flex items-center justify-center relative overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-blue-500/5"></div>
                <span className="text-xs font-mono font-semibold text-slate-400 z-10 px-3 py-1 bg-white/95 rounded-md border border-slate-200 shadow-sm">
                  Blueprint Preview Active
                </span>
                {lengthVal > 0 && widthVal > 0 && (
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400">
                    {lengthVal}m × {widthVal}m
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optimization Tip Card (Dark Slate) */}
          <div className="bg-slate-900 text-white rounded-custom p-6 space-y-3 shadow-premium relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <h2 className="text-xs font-bold text-primary-light uppercase tracking-wider flex items-center gap-2">
              💡 Optimization Tip
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard industrial departments are often sized in multiples of 12 meters. Aligning your factory floor dimensions to this grid will simplify machine spacing, safety corridor sizing, and routing paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
