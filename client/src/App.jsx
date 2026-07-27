import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FactoryProvider } from './context/FactoryContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Import Pages
import Dashboard from './pages/Dashboard';
import CreateFactory from './pages/CreateFactory';
import LayoutDesigner from './pages/LayoutDesigner';
import ProductionFlow from './pages/ProductionFlow';
import Analysis from './pages/Analysis';
import Suggestions from './pages/Suggestions';
import Reports from './pages/Reports';

function AppContent() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sticky Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Screen Layout Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sticky Top Navbar */}
        <Navbar />

        {/* Dynamic page content container */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateFactory />} />
          <Route path="/designer/:id" element={<LayoutDesigner />} />
          <Route path="/flow/:id" element={<ProductionFlow />} />
          <Route path="/analysis/:id" element={<Analysis />} />
          <Route path="/suggestions/:id" element={<Suggestions />} />
          <Route path="/report/:id" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FactoryProvider>
        <AppContent />
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
      </FactoryProvider>
    </BrowserRouter>
  );
}
