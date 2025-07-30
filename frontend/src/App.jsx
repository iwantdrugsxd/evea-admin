import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import AdminDashboard from './pages/admin-dashboard';
import VendorManagement from './pages/vendor-management';
import OrderManagement from './pages/order-management';
import FinancialManagement from './pages/financial-management';
import Analytics from './pages/analytics';
import SystemSettings from './pages/system-settings';
import './App.css';

// CSS Variables
import './styles/variables.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vendor-management" element={<VendorManagement />} />
          <Route path="/admin/order-management" element={<OrderManagement />} />
          <Route path="/admin/financial-management" element={<FinancialManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/system-settings" element={<SystemSettings />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;