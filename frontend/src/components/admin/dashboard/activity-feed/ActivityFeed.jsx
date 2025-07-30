import React, { useState } from 'react';
import { 
  Activity, User, ShoppingBag, IndianRupee, 
  CheckCircle, AlertCircle, Clock, MoreVertical 
} from 'lucide-react';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all');

  const activities = [
    {
      id: 1,
      type: 'vendor_approved',
      title: 'New vendor approved',
      description: 'Mumbai Caterers has been approved as a vendor',
      time: '2 minutes ago',
      icon: <CheckCircle size={16} />,
      iconColor: 'success'
    },
    {
      id: 2,
      type: 'order_placed',
      title: 'New order received',
      description: 'Wedding decoration order #1234 placed',
      time: '5 minutes ago',
      icon: <ShoppingBag size={16} />,
      iconColor: 'info'
    },
    {
      id: 3,
      type: 'payment_received',
      title: 'Payment received',
      description: '₹45,000 payment confirmed for order #1230',
      time: '12 minutes ago',
      icon: <IndianRupee size={16} />,
      iconColor: 'success'
    },
    {
      id: 4,
      type: 'vendor_pending',
      title: 'Vendor pending approval',
      description: 'Delhi Events requires admin review',
      time: '18 minutes ago',
      icon: <Clock size={16} />,
      iconColor: 'warning'
    },
    {
      id: 5,
      type: 'user_registered',
      title: 'New user registration',
      description: 'Priya Sharma registered as customer',
      time: '25 minutes ago',
      icon: <User size={16} />,
      iconColor: 'info'
    },
    {
      id: 6,
      type: 'order_cancelled',
      title: 'Order cancelled',
      description: 'Photography order #1228 cancelled by customer',
      time: '1 hour ago',
      icon: <AlertCircle size={16} />,
      iconColor: 'error'
    }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type.includes(filter));

  const getIconColorClass = (color) => {
    switch (color) {
      case 'success': return 'activity-icon-success';
      case 'warning': return 'activity-icon-warning';
      case 'error': return 'activity-icon-error';
      case 'info': return 'activity-icon-info';
      default: return 'activity-icon-default';
    }
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>Recent Activity</h3>
        <select 
          className="filter-select" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Activity</option>
          <option value="vendor">Vendors</option>
          <option value="order">Orders</option>
          <option value="payment">Payments</option>
          <option value="user">Users</option>
        </select>
      </div>

      <div className="activity-list">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${getIconColorClass(activity.iconColor)}`}>
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <h4 className="activity-title">{activity.title}</h4>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
              </div>
              <button className="activity-menu">
                <MoreVertical size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-activity">
            <Activity size={48} />
            <p>No activities found</p>
            <span>Check back later for updates</span>
          </div>
        )}
      </div>

      <div className="feed-footer">
        <button className="view-all-btn">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;