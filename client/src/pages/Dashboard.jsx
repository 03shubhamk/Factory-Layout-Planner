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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="bg-white p-6 rounded-custom border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Layouts</span>
            <span className="text-2xl font-bold text-slate-900">{dashboardStats.totalProjects}</span>
          </div>
        </div>

        {/* Average Efficiency */}
        <div className="bg-white p-6 rounded-custom border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Avg. Efficiency</span>
            <span className="text-2xl font-bold text-slate-900">{dashboardStats.avgEfficiency}%</span>
          </div>
        </div>

        {/* Best Layout */}
        <div className="bg-white p-6 rounded-custom border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-warning flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Best Performer</span>
            <span className="text-lg font-bold text-slate-900 truncate block leading-tight mt-1">
              {dashboardStats.bestLayout}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-white p-6 rounded-custom border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Last Updated</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">{dashboardStats.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="bg-white rounded-custom border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Saved Projects</h2>
          <span className="text-xs text-slate-500 font-mono">Count: {factories.length}</span>
        </div>

        {factories.length === 0 ? (
          <div className="p-16 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-700">No factory layouts found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Get started by creating your first factory grid and defining production flows.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Factory Layout
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-semibold text-xs tracking-wider uppercase border-b border-slate-200">
                  <th className="px-6 py-4">Factory Name</th>
                  <th className="px-6 py-4">Floor Dimensions</th>
                  <th className="px-6 py-4 text-center">Placed Nodes</th>
                  <th className="px-6 py-4 text-center">Efficiency Score</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
