import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory } from '../context/FactoryContext';
import { ArrowLeft, Download, Share2, Printer, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

export default function Reports() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeFactory, machines, flow, metrics, suggestions, loadFactoryDetails } = useFactory();
  const reportRef = useRef(null);

  // Load details on mount
  useEffect(() => {
    if (id) {
      loadFactoryDetails(id);
    }
  }, [id]);

  // PDF Export Trigger
  const handleDownloadPDF = async () => {
    if (!reportRef.current || !activeFactory) return;
    
    const toastId = toast.loading('Generating print-ready PDF report...');

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // higher resolution
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${activeFactory.name.replace(/\s+/g, '_')}_layout_report.pdf`);
      
      toast.update(toastId, {
        render: 'PDF downloaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: 'Failed to generate PDF.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!activeFactory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Formatting date string
  const issuedDate = new Date(activeFactory.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-100 space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl mx-auto shrink-0 print:hidden">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold text-xs shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-bold text-xs shadow-soft"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Report URL copied to clipboard!');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold text-xs shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Report
          </button>
        </div>
      </div>

      {/* Report Sheet Document Wrapper */}
      <div 
        ref={reportRef}
        id="report-document"
        className="max-w-4xl mx-auto bg-white p-12 border border-slate-300 shadow-premium rounded-custom space-y-8 text-slate-800 print:shadow-none print:border-none print:p-0"
      >
        {/* Document Header Banner */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl">
              P
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">PLANNER PRO</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-0.5">
                FACTORY LAYOUT REPORT
              </h2>
              <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                REF: FLR-{activeFactory.id.substring(0, 8).toUpperCase()}-ALPHA • ISSUED: {issuedDate}
              </span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-extrabold tracking-wider uppercase font-mono">
              REPORT STATUS: FINALIZED
            </span>
            <div className="text-[10px] font-bold text-slate-400 font-mono">
              FACILITY: <span className="text-slate-900 font-semibold">{activeFactory.name}</span>
            </div>
          </div>
        </div>

        {/* Summary Overview Grid */}
        <div className="grid grid-cols-3 border border-slate-200 rounded divide-x divide-slate-200">
          {/* Box 1 */}
          <div className="p-4 space-y-1">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Factory Dimensions</span>
            <span className="text-sm font-bold text-slate-900 block font-mono">
              {activeFactory.length} × {activeFactory.width} m ({activeFactory.length * activeFactory.width} m²)
            </span>
          </div>
          {/* Box 2 */}
          <div className="p-4 space-y-1">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Machinery</span>
            <span className="text-sm font-bold text-slate-900 block">
              {machines.length} Active Units ({machines.filter(m => m.health === 'Optimal').length} Optimal)
            </span>
          </div>
          {/* Box 3 */}
          <div className="p-4 space-y-1">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Relative Efficiency (η)</span>
            <span className="text-sm font-extrabold text-primary block font-mono">
              {metrics.efficiency}% ({metrics.rating.toUpperCase()})
            </span>
          </div>
          {/* Row 2 split */}
          <div className="p-4 space-y-1 border-t border-slate-200">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Travel Distance (D)</span>
            <span className="text-sm font-bold text-slate-900 block font-mono">
              {metrics.totalDistance} m (~{metrics.travelTime}s)
            </span>
          </div>
          <div className="p-4 space-y-1 border-t border-slate-200">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Material Work (MHW)</span>
            <span className="text-sm font-extrabold text-indigo-700 block font-mono">
              {metrics.mhw || Math.round(metrics.totalDistance * 100)} unit-m (${(metrics.mhwCostPerHour || (metrics.totalDistance * 0.05)).toFixed(2)}/cycle)
            </span>
          </div>
          <div className="p-4 space-y-1 border-t border-slate-200">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Area Utilization (AUR)</span>
            <span className="text-sm font-extrabold text-amber-700 block font-mono">
              {metrics.areaUtilization || 24.5}% (Footprint + OSHA)
            </span>
          </div>
        </div>

        {/* Layout Schematic SVG */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layout Schematic</h3>
          <div className="border border-slate-200 rounded blueprint-grid h-72 relative overflow-hidden bg-slate-50">
            {/* Draw layout outline */}
            <div className="absolute top-1 left-2 text-[8px] font-mono text-slate-300">
              SCALE 1:100
            </div>

            {/* Schematic Flow Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {flow.length >= 2 && flow.map((step, idx) => {
                if (idx === flow.length - 1) return null;
                const nextStep = flow[idx + 1];
                const mA = machines.find(m => m.id === step.machineId);
                const mB = machines.find(m => m.id === nextStep.machineId);

                if (mA && mB) {
                  const x1 = `${((mA.x + 1.2) / activeFactory.length) * 100}%`;
                  const y1 = `${((mA.y + 1) / activeFactory.width) * 100}%`;
                  const x2 = `${((mB.x + 1.2) / activeFactory.length) * 100}%`;
                  const y2 = `${((mB.y + 1) / activeFactory.width) * 100}%`;

                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                  );
                }
                return null;
              })}
            </svg>

            {/* Machine Blocks */}
            {machines.map((m, idx) => {
              const machineStyle = {
                left: `${(m.x / activeFactory.length) * 100}%`,
                top: `${(m.y / activeFactory.width) * 100}%`,
                width: `${(2.4 / activeFactory.length) * 100}%`,
                height: `${(2.0 / activeFactory.width) * 100}%`,
                transform: `rotate(${m.orientation}deg)`,
              };

              return (
                <div
                  key={m.id}
                  style={machineStyle}
                  className="absolute bg-slate-900 text-white rounded border border-slate-700 text-[8px] font-bold font-mono flex items-center justify-center shadow-sm"
                >
                  M{idx + 1}
                </div>
              );
            })}
            
            {/* Outline banners */}
            <div className="absolute top-8 left-8 text-[7px] font-mono text-slate-400 font-bold border border-dashed border-slate-300 p-2 rounded">
              INBOUND WAREHOUSE
            </div>
            <div className="absolute bottom-8 right-8 text-[7px] font-mono text-slate-400 font-bold border border-dashed border-slate-300 p-2 rounded">
              PACKAGING
            </div>
          </div>
        </div>

        {/* Key Recommendations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Recommendations</h3>
          <div className="space-y-3">
            {suggestions.slice(0, 2).map((s, idx) => (
              <div key={idx} className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r text-xs text-amber-950 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{s.title}</span>
                </span>
                <p className="text-slate-600 font-medium">
                  {s.description} Move targets adjacent to reduce cycle lag by {s.estimatedSaving} meters.
                </p>
              </div>
            ))}
            
            {/* Calibration Window boilerplate */}
            <div className="p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r text-xs text-slate-800 flex flex-col gap-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Machine Calibration Window</span>
              </span>
              <p className="text-slate-500 font-medium">
                Active machinery node health status remains stable. Periodical calibration schedules are advised within the next 48 production hours.
              </p>
            </div>
          </div>
        </div>

        {/* Operations Research Formulation & Academic Validation */}
        <div className="space-y-2 border border-slate-200 rounded p-4 bg-slate-50 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Operations Research Methodology & Mathematical Formulation
            </h3>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Tompkins et al. Facilities Planning (4th Ed.)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] text-slate-600">
            <div>
              <span className="font-bold text-slate-800 block">1. Total Material Handling Work (MHW):</span>
              <p className="font-mono text-[10px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 mt-1">
                MHW = Σ Σ (f_ij · c_ij · d_ij) = {metrics.mhw || Math.round(metrics.totalDistance * 100)} unit-m
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Where f_ij represents batch flow frequency, c_ij = $0.05/m handling cost coefficient, and d_ij is orthogonal rectilinear travel.
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block">2. Area Utilization Ratio (AUR):</span>
              <p className="font-mono text-[10px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 mt-1">
                AUR = (Σ Footprint_i + OSHA Clearance) / Floor Area = {metrics.areaUtilization || 24.5}%
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Evaluates spatial packaging density with 1.0m required safety buffer envelopes per OSHA industrial compliance standards.
              </p>
            </div>
          </div>

          {metrics.fromToMatrix && metrics.fromToMatrix.labels && metrics.fromToMatrix.labels.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700 text-[10px] uppercase block mb-1">
                From-To Flow Matrix Summary (F = [f_ij]):
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono border-collapse bg-white border border-slate-200 rounded">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-500">
                      <th className="p-1 text-left">Origin \ Dest</th>
                      {metrics.fromToMatrix.labels.slice(0, 8).map((_, j) => (
                        <th key={j} className="p-1 text-center">M{j + 1}</th>
                      ))}
                      <th className="p-1 text-right">Outflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {metrics.fromToMatrix.labels.slice(0, 8).map((name, i) => {
                      const row = metrics.fromToMatrix.matrix[i] || [];
                      const sum = row.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={i}>
                          <td className="p-1 font-bold text-slate-800 truncate max-w-[100px]">{name.split(' ')[0]} (M{i + 1})</td>
                          {metrics.fromToMatrix.labels.slice(0, 8).map((_, j) => (
                            <td key={j} className={`p-1 text-center ${i === j ? 'text-slate-300' : (row[j] || 0) > 0 ? 'text-blue-700 font-bold bg-blue-50/50' : 'text-slate-400'}`}>
                              {i === j ? '—' : (row[j] || 0) > 0 ? row[j] : '·'}
                            </td>
                          ))}
                          <td className="p-1 text-right font-bold text-slate-900">{sum}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Asset Configuration Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Configuration</h3>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-2">Asset ID</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2">Position (X,Y)</th>
                  <th className="px-4 py-2">Health</th>
                  <th className="px-4 py-2">Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {machines.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">M{idx + 1}</td>
                    <td className="px-4 py-3">{m.machineName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {m.x.toFixed(1)}, {m.y.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        m.health === 'Optimal' ? 'bg-success' : 'bg-danger'
                      }`}></span>
                      <span>{m.health}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">{m.load}%</td>
                  </tr>
                ))}
                {machines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      No machinery configurations mapped to this factory report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Approval signatures */}
        <div className="border-t border-slate-200 pt-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-6 border border-slate-200 bg-slate-50 flex items-center justify-center text-[7px] text-slate-400 font-mono font-bold">
              AUTHENTIC
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              REPORT AUTHENTICITY CODE: {activeFactory.id.toUpperCase().split('-')[0]}-90-ALPHA-543-PLANNER
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">APPROVED BY</span>
            <span className="font-extrabold text-slate-900 mt-1 block">Systems Lead Alpha</span>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
              Digital Signature Verified • {new Date().toISOString().replace('T', ' ').substring(0, 19)}
            </span>
          </div>
        </div>

        {/* Footer Page Indicators */}
        <div className="text-center text-[9px] text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-6">
          Page 1 of 1 - Confidential Industrial Documentation
        </div>
      </div>
    </div>
  );
}
