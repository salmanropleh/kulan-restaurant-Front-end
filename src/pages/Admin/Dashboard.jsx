// Front-End/src/pages/admin/Dashboard.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeBanner from "../../components/Dashboard/WelcomeBanner";
import StatsGrid from "../../components/Dashboard/StatsGrid";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import RecentReservations from "../../components/Dashboard/RecentReservations";
import Categories from "./Categories";
import MenuItems from "./MenuItems";
import Orders from "./Orders";
import OrderItems from "./OrderItems";
import Reservations from "./Reservations";
import Messages from "./Messages";
import Settings from "./Settings";

// Main Dashboard Content Component
const DashboardContent = () => {
  return (
    <>
      <WelcomeBanner />
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RecentOrders />
        <RecentReservations />
      </div>
    </>
  );
};

const Dashboard = () => {
  const location = useLocation();

  return (
    <DashboardLayout currentPath={location.pathname}>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/add" element={<div>Add Category Page</div>} />
        <Route
          path="/categories/:id"
          element={<div>Category Details Page</div>}
        />
        <Route
          path="/categories/:id/edit"
          element={<div>Edit Category Page</div>}
        />
        <Route path="/menu-items" element={<MenuItems />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-items" element={<OrderItems />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
