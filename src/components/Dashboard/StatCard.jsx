import React from "react";

const StatCard = ({ title, value, color, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div
          className={`${color} rounded-lg p-3 mr-4 flex items-center justify-center`}
        >
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {title.charAt(0)}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {value === "Error" ? (
                <span className="text-red-500 text-sm">Failed to load</span>
              ) : typeof value === "number" ? (
                value.toLocaleString()
              ) : (
                value
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
