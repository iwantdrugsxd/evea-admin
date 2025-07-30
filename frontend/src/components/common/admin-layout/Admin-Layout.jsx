import React, { useState, useEffect } from 'react';
import AdminSidebar from '../admin-sidebar/Admin-Sidebar';
import AdminHeader from '../admin-header/Admin-Header';
import './Admin-Layout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      
      <div className={`admin-main ${sidebarOpen && !isMobile ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="admin-content">
          <div className="admin-content-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;