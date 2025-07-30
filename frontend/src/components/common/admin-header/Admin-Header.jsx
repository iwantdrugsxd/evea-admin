import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Search, Bell, User, Settings, 
  LogOut, ChevronDown, Moon, Sun, Mail,
  HelpCircle, Shield, Calendar, Clock
} from 'lucide-react';
import './Admin-Header.css';

const AdminHeader = ({ onToggleSidebar, sidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Get user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Wedding photography order from Mumbai',
      time: '2 minutes ago',
      unread: true,
      avatar: '📸'
    },
    {
      id: 2,
      type: 'vendor',
      title: 'Vendor Application',
      message: 'Delhi Caterers submitted application',
      time: '15 minutes ago',
      unread: true,
      avatar: '👨‍🍳'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Confirmed',
      message: '₹45,000 payment received for order #1234',
      time: '1 hour ago',
      unread: false,
      avatar: '💰'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New features available in analytics dashboard',
      time: '2 hours ago',
      unread: false,
      avatar: '🔧'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const markAllAsRead = () => {
    // Update all notifications as read
    console.log('Marking all notifications as read');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="header-info">
          <div className="date-time">
            <div className="current-time">
              <Clock size={16} />
              {formatTime(currentTime)}
            </div>
            <div className="current-date">
              <Calendar size={16} />
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search orders, vendors, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="header-right">
        {/* Help Button */}
        <button
          className="header-action-btn"
          title="Help & Support"
        >
          <HelpCircle size={18} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="header-action-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="notification-container" ref={notificationRef}>
          <button
            className="header-action-btn notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="mark-all-read" onClick={markAllAsRead}>
                  Mark all read
                </button>
              </div>
              
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-avatar">
                      {notification.avatar}
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {notification.unread && <div className="unread-indicator"></div>}
                  </div>
                ))}
              </div>
              
              <div className="dropdown-footer">
                <button className="view-all-notifications">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="profile-container" ref={profileMenuRef}>
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            <div className="profile-avatar">
              {getInitials(user?.name || 'Admin User')}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'Admin User'}</span>
              <span className="profile-role">Administrator</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'rotated' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <div className="user-avatar">
                  {getInitials(user?.name || 'Admin User')}
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.name || 'Admin User'}</div>
                  <div className="user-email">{user?.email || 'admin@evea.com'}</div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-item">
                <User size={16} />
                <span>My Profile</span>
              </div>
              
              <div className="dropdown-item">
                <Settings size={16} />
                <span>Account Settings</span>
              </div>
              
              <div className="dropdown-item">
                <Shield size={16} />
                <span>Security</span>
              </div>
              
              <div className="dropdown-item">
                <Mail size={16} />
                <span>Messages</span>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;