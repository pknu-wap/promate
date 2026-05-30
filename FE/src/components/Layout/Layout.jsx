import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="layout-body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;