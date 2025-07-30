import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/common/admin-layout/Admin-Layout.jsx';
import StatsGrid from '../components/admin/dashboard/stats-grid/StatsGrid.jsx';
import RevenueChart from '../components/admin/dashboard/revenue-chart/RevenueChart.jsx';
import ActivityFeed from '../components/admin/dashboard/activity-feed/ActivityFeed.jsx';
import QuickActions from '../components/admin/dashboard/quick-actions/QuickActions.jsx';
import RecentOrders from '../components/admin/dashboard/recent-orders/RecentOrders.jsx';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user info
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}! 👋
              </h1>
              <p className="dashboard-subtitle">
                Here's what's happening with your event platform today.
              </p>
            </div>
            <div className="dashboard-date">
              <div className="current-date">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="dashboard-section">
            <StatsGrid />
          </div>

          {/* Charts and Activity Section */}
          <div className="dashboard-grid">
            <div className="dashboard-main">
              {/* Revenue Chart */}
              <div className="chart-section">
                <RevenueChart />
              </div>

              {/* Recent Orders */}
              <div className="orders-section">
                <RecentOrders />
              </div>
            </div>

            <div className="dashboard-sidebar">
              {/* Quick Actions */}
              <div className="quick-actions-section">
                <QuickActions />
              </div>

              {/* Activity Feed */}
              <div className="activity-section">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;