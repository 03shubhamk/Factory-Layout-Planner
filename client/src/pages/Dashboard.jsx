import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { 
  Building2, 
  BarChart2, 
  Trophy, 
  Clock, 
  Plus, 
  ArrowRight, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    factories, 
    dashboardStats, 
    loadFactories, 
    loadFactoryDetails, 
    deleteFactory,
    activeFactory 
  } = useFactory();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadFactories();
  }, []);

  const handleOpenFactory = async (id) => {
    await loadFactoryDetails(id);
    navigate(`/designer/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    if (deleteConfirmId) {
      await deleteFactory(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Factory Layouts Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, edit, and optimize your industrial plant layouts and production line efficiency.
          </p>
        </div>
        
        <div className="flex gap-3">
          {activeFactory && (
            <button
              onClick={() => navigate(`/designer/${activeFactory.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-semibold text-sm shadow-soft"
            >
              Resume Active
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold text-sm shadow-soft"
          >
            <Plus className="w-4 h-4" />
            New Factory
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">Total Facilities</span>
            <span className="text-2xl font-bold font-mono text-slate-900">{dashboardStats.totalProjects}</span>
          </div>
        </div>

        {/* Average Efficiency */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">Fleet Mean Efficiency</span>
            <span className="text-2xl font-bold font-mono text-slate-900">{dashboardStats.avgEfficiency}%</span>
          </div>
        </div>

        {/* Best Layout */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">Optimal Plant</span>
            <span className="text-base font-bold text-slate-900 truncate block leading-tight mt-0.5">
              {dashboardStats.bestLayout}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">Last Telemetry Sync</span>
            <span className="text-xs font-mono font-bold text-slate-700 block mt-1">{dashboardStats.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Active Plant Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and launch CAD workspaces for registered facilities.</p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {factories.length} Registered
          </span>
        </div>

        {factories.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-slate-700">No factory configurations found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Get started by creating a new facility floor grid and arranging machinery assets.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Initialize Plant Grid
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-mono font-bold text-[10px] tracking-wider uppercase border-b border-slate-200">
                  <th className="px-5 py-3">Facility Designation</th>
                  <th className="px-5 py-3">Floor Geometry</th>
                  <th className="px-5 py-3 text-center">Asset Density</th>
                  <th className="px-5 py-3 text-center">Audit Efficiency</th>
                  <th className="px-5 py-3">Created Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {factories.map((factory) => {
                  const latestReport = factory.reports && factory.reports[0];
                  const efficiency = latestReport ? Math.round(latestReport.efficiency) : 100;
                  const machineCount = factory.machines ? factory.machines.length : 0;
                  
                  let badgeColor = 'bg-slate-100 text-slate-700';
                  if (efficiency >= 90) badgeColor = 'bg-emerald-50 text-success border-emerald-100';
                  else if (efficiency >= 75) badgeColor = 'bg-blue-50 text-primary border-blue-100';
                  else if (efficiency >= 60) badgeColor = 'bg-amber-50 text-warning border-amber-100';
                  else badgeColor = 'bg-rose-50 text-danger border-rose-100';

                  return (
                    <tr 
                      key={factory.id} 
                      onClick={() => handleOpenFactory(factory.id)}
                      className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {factory.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {factory.length}m × {factory.width}m
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-600">
                        {machineCount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                          {efficiency}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(factory.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {deleteConfirmId === factory.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-rose-500 font-medium mr-1">Confirm delete?</span>
                            <button
                              onClick={confirmDelete}
                              className="px-2 py-1 bg-danger text-white rounded text-xs hover:bg-red-600 font-bold transition-all"
                            >
                              Yes
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300 font-bold transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenFactory(factory.id)}
                              title="Open Editor"
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-md transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, factory.id)}
                              title="Delete Layout"
                              className="p-1.5 text-slate-500 hover:text-danger hover:bg-rose-50 rounded-md transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
