import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  // Lebar sidebar 768px (md)
  const [isSidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          // Lebar sidebar baru: 60 (240px) terbuka, 20 (80px) tertutup
          isSidebarOpen ? 'md:ml-60' : 'md:ml-20' 
        }`}
      >
        <Header isSidebarOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10" /* Padding diperbesar */
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;