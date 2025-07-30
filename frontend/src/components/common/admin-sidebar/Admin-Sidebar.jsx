import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShoppingBag, IndianRupee, 
  BarChart3, Settings, LogOut, X, Menu, Building2
} from 'lucide-react';
import './Admin-Sidebar.css';

const AdminSidebar = ({ isOpen, onToggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
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
  
  // Get active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/vendor-management')) return 'vendors';
    if (path.includes('/admin/order-management')) return 'orders';
    if (path.includes('/admin/financial-management')) return 'financial';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/system-settings')) return 'settings';
    return 'dashboard';
  };

  const activeItem = getActiveItem();

  const handleNavigation = (itemId, path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
    
    // Close sidebar on mobile after navigation
    if (isMobile && isOpen) {
      setTimeout(() => onToggle(), 150);
    }
  };

  const navigationItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin/dashboard',
      badge: null,
      tooltip: 'Dashboard Overview'
    },
    { 
      id: 'vendors', 
      name: 'Vendors', 
      icon: <Users size={20} />, 
      path: '/admin/vendor-management',
      badge: 5,
      tooltip: 'Vendor Management'
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: <ShoppingBag size={20} />, 
      path: '/admin/order-management',
      badge: 12,
      tooltip: 'Order Management'
    },
    { 
      id: 'financial', 
      name: 'Financial', 
      icon: <IndianRupee size={20} />, 
      path: '/admin/financial-management',
      badge: null,
      tooltip: 'Financial Management'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: <BarChart3 size={20} />, 
      path: '/admin/analytics',
      badge: null,
      tooltip: 'Analytics & Reports'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/admin/system-settings',
      badge: null,
      tooltip: 'System Settings'
    }
  ];

  const handleLogout = async () => {
    try {
      // Call logout API
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      
      // Redirect to login
      navigate('/auth/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Building2 size={18} />
          </div>
          {isOpen && <h2>EVEA Admin</h2>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-navigation">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id, item.path)}
                aria-label={`Navigate to ${item.name}`}
                data-tooltip={item.tooltip}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && (
                  <>
                    <span className="nav-text">{item.name}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Profile */}
      {isOpen && (
        <div className="admin-profile">
          <div className="profile-info">
            <div className="profile-avatar">
              {getInitials(user?.name || 'Admin User')}
            </div>
            <div className="profile-details">
              <div className="profile-name">
                {user?.name || 'Admin User'}
              </div>
              <div className="profile-email">
                {user?.email || 'admin@evea.com'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          aria-label="Logout"
          data-tooltip="Logout"
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;