import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, Clock, XCircle, Search, 
  Filter, Download, Plus, Eye, MoreHorizontal 
} from 'lucide-react';
import AdminLayout from '../components/common/admin-layout/Admin-Layout.jsx';
// import VendorTable from '../components/admin/vendor-approval/vendor-table/VendorTable';
import VendorDetailsModal from '../components/admin/vendor-approval/vendor-details-modal/VendorDetailsModal';
import './vendor-management.css';

const VendorManagement = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  return (
    <AdminLayout>
      <div className="vendor-management">
        <div className="vendor-header">
          <div className="header-content">
            <h1>Vendor Management</h1>
            <p>Review and manage vendor applications and profiles</p>
          </div>
          <div className="vendor-stats">
            <div className="stat-item total">
              <span className="stat-value">156</span>
              <span className="stat-label">Total Vendors</span>
            </div>
            <div className="stat-item pending">
              <span className="stat-value">12</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item approved">
              <span className="stat-value">134</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item rejected">
              <span className="stat-value">10</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        <VendorTable
          filters={filters}
          onFiltersChange={setFilters}
          onVendorSelect={handleVendorSelect}
        />

        {showDetailsModal && selectedVendor && (
          <VendorDetailsModal
            vendor={selectedVendor}
            onClose={() => setShowDetailsModal(false)}
            onUpdate={() => {
              // Refresh vendor list
              setShowDetailsModal(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorManagement;