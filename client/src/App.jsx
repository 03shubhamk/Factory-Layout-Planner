import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FactoryProvider } from './context/FactoryContext';
import { MachineProvider } from './context/MachineContext';
import { FlowProvider } from './context/FlowContext';
import { LayoutProvider } from './context/LayoutContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import CreateFactory from './pages/CreateFactory';
import LayoutDesigner from './pages/LayoutDesigner';
import ProductionFlow from './pages/ProductionFlow';
import Analysis from './pages/Analysis';
import Suggestions from './pages/Suggestions';
import Reports from './pages/Reports';
import LiveCommandCenter from './pages/LiveCommandCenter';

function AppContent() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateFactory />} />
          <Route path="/designer/:id" element={<LayoutDesigner />} />
          <Route path="/flow/:id" element={<ProductionFlow />} />
          <Route path="/analysis/:id" element={<Analysis />} />
          <Route path="/suggestions/:id" element={<Suggestions />} />
          <Route path="/report/:id" element={<Reports />} />
          <Route path="/telemetry/:id" element={<LiveCommandCenter />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FactoryProvider>
        <TelemetryProvider>
          <MachineProvider>
            <FlowProvider>
              <LayoutProvider>
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </LayoutProvider>
            </FlowProvider>
          </MachineProvider>
          <ToastContainer 
            position="bottom-right" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </TelemetryProvider>
      </FactoryProvider>
    </BrowserRouter>
  );
}
