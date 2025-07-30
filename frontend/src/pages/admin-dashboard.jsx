import React from 'react';
import AdminLayout from '../components/common/admin-layout/Admin-Layout.jsx';
import StatsGrid from '../components/admin/dashboard/stats-grid/StatsGrid.jsx';  // assuming it exists
import RevenueChart from '../components/admin/dashboard/revenue-chart/RevenueChart.jsx';  // assuming it exists
import ActivityFeed from '../components/admin/dashboard/activity-feed/ActivityFeed.jsx';  // assuming it exists
import './admin-dashboard.css';
const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening on your platform today.</p>
        </div>

        <StatsGrid />

        <div className="dashboard-content">
          <div className="dashboard-main">
            <RevenueChart />
          </div>
          <div className="dashboard-sidebar">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;