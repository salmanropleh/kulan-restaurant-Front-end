// Front-End/src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children, currentPath }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleCloseMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Full-width header with hamburger menu */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      {/* Sidebar below header, content on the right */}
      <div className="flex flex-1">
        <Sidebar
          currentPath={currentPath}
          mobileSidebarOpen={mobileSidebarOpen}
          onCloseMobile={handleCloseMobileSidebar}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:ml-0">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
