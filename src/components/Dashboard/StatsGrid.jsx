import React from "react";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const stats = [
    { title: "Categories", value: "4", color: "bg-blue-500" },
    { title: "Order Items", value: "14", color: "bg-green-500" },
    { title: "Menu Items", value: "9", color: "bg-purple-500" },
    { title: "Reservations", value: "4", color: "bg-yellow-500" },
    { title: "Total Orders", value: "11", color: "bg-red-500" },
    { title: "Unread Messages", value: "6", color: "bg-indigo-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
