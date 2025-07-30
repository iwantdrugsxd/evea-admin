import React from 'react';
import { Users, ShoppingBag, IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './StatsGrid.css';

const StatsGrid = () => {
  const stats = [
    {
      id: 'vendors',
      title: 'Total Vendors',
      value: '248',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Users size={24} />,
      iconColor: 'green',
      description: '23 new this month'
    },
    {
      id: 'orders',
      title: 'Active Orders',
      value: '1,423',
      change: '+8.2%',
      changeType: 'positive',
      icon: <ShoppingBag size={24} />,
      iconColor: 'blue',
      description: '156 pending approval'
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '₹12,45,000',
      change: '+15.3%',
      changeType: 'positive',
      icon: <IndianRupee size={24} />,
      iconColor: 'purple',
      description: 'Target: ₹15,00,000'
    },
    {
      id: 'growth',
      title: 'Growth Rate',
      value: '23.4%',
      change: '-2.1%',
      changeType: 'negative',
      icon: <TrendingUp size={24} />,
      iconColor: 'orange',
      description: 'vs last quarter'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.id} className={`stat-card stat-${stat.iconColor}`}>
          <div className="stat-header">
            <div className={`stat-icon stat-icon-${stat.iconColor}`}>
              {stat.icon}
            </div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.changeType === 'positive' ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
              {stat.change}
            </div>
          </div>
          
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
          
          <div className="stat-footer">
            <div className="stat-progress">
              <div 
                className={`stat-progress-bar stat-progress-${stat.iconColor}`} 
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;