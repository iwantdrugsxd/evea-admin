import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, Users, 
  Calendar, Download, Filter, RefreshCw 
} from 'lucide-react';
import AdminLayout from '../components/common/admin-layout/Admin-Layout.jsx';
// import FinancialCards from '../components/admin/financial/financial-cards/FinancialCards.jsx';  // Corrected
// import TransactionTable from '../components/admin/financial/transactions-table/TransactionsTable.jsx';  // Corrected
// import PayoutManagement from '../components/admin/financial/payout-management/PayoutManagement.jsx';  // Corrected
import './financial-management.css';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <DollarSign size={16} /> },
    { id: 'transactions', name: 'Transactions', icon: <CreditCard size={16} /> },
    { id: 'payouts', name: 'Vendor Payouts', icon: <Users size={16} /> }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <AdminLayout>
      <div className="financial-management">
        <div className="financial-header">
          <div className="header-content">
            <h1>Financial Management</h1>
            <p>Monitor revenue, transactions, and vendor payouts</p>
          </div>
          <div className="header-actions">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={handleRefresh}
              className="refresh-btn"
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="financial-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <div className="financial-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <FinancialCards dateRange={dateRange} />
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div className="transactions-tab">
              <TransactionTable dateRange={dateRange} />
            </div>
          )}
          
          {activeTab === 'payouts' && (
            <div className="payouts-tab">
              <PayoutManagement />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialManagement;