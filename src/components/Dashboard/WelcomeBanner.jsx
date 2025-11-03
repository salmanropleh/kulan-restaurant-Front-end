import React from "react";

const WelcomeBanner = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        KULAN Restaurant Dashboard
      </h2>
      <p className="text-gray-600">Welcome to restaurant management</p>
    </div>
  );
};

export default WelcomeBanner;
