import React, { useState } from 'react';
import { TrendingUp, Calendar, Download, MoreVertical } from 'lucide-react';
import './RevenueChart.css';

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showOptions, setShowOptions] = useState(false);

  // Sample revenue data for the chart
  const revenueData = {
    '7days': [
      { day: 'Mon', revenue: 45000, orders: 12 },
      { day: 'Tue', revenue: 52000, orders: 15 },
      { day: 'Wed', revenue: 48000, orders: 13 },
      { day: 'Thu', revenue: 61000, orders: 18 },
      { day: 'Fri', revenue: 55000, orders: 16 },
      { day: 'Sat', revenue: 73000, orders: 22 },
      { day: 'Sun', revenue: 68000, orders: 20 }
    ],
    '30days': [
      { day: 'Week 1', revenue: 320000, orders: 89 },
      { day: 'Week 2', revenue: 380000, orders: 105 },
      { day: 'Week 3', revenue: 425000, orders: 118 },
      { day: 'Week 4', revenue: 390000, orders: 112 }
    ],
    '3months': [
      { day: 'Month 1', revenue: 1200000, orders: 345 },
      { day: 'Month 2', revenue: 1450000, orders: 398 },
      { day: 'Month 3', revenue: 1680000, orders: 456 }
    ]
  };

  const currentData = revenueData[selectedPeriod];
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));
  const totalRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = currentData.reduce((sum, d) => sum + d.orders, 0);

  const periods = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '3months', label: 'Last 3 months' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = () => {
    console.log('Exporting revenue data...');
    // Implementation for exporting data
  };

  return (
    <div className="revenue-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>Revenue Overview</h3>
          <div className="chart-summary">
            <div className="summary-item">
              <span className="summary-label">Total Revenue</span>
              <span className="summary-value">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Orders</span>
              <span className="summary-value">{totalOrders}</span>
            </div>
          </div>
        </div>
        
        <div className="chart-controls">
          <select 
            className="period-select" 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <button className="chart-action-btn" onClick={handleExport}>
            <Download size={16} />
          </button>
          
          <div className="chart-options">
            <button 
              className="chart-action-btn"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={16} />
            </button>
            
            {showOptions && (
              <div className="options-dropdown">
                <button onClick={() => console.log('View Details')}>
                  View Details
                </button>
                <button onClick={() => console.log('Share Chart')}>
                  Share Chart
                </button>
                <button onClick={handleExport}>
                  Export Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-grid">
          {/* Y-axis labels */}
          <div className="chart-y-axis">
            {[100, 75, 50, 25, 0].map((percent) => (
              <div key={percent} className="y-axis-label">
                {formatCurrency((maxRevenue * percent) / 100)}
              </div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div className="chart-bars">
            {currentData.map((data, index) => {
              const barHeight = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="chart-bar-container">
                  <div className="chart-tooltip">
                    <div className="tooltip-content">
                      <strong>{formatCurrency(data.revenue)}</strong>
                      <br />
                      {data.orders} orders
                    </div>
                  </div>
                  <div 
                    className="chart-bar" 
                    style={{ height: `${barHeight}%` }}
                  ></div>
                  <div className="x-axis-label">{data.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color revenue-color"></div>
          <span>Revenue</span>
        </div>
        <div className="trend-indicator">
          <TrendingUp size={16} />
          <span className="trend-text positive">+15.3% vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;