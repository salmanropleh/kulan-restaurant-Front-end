import React from "react";
import { Shield } from "lucide-react";

const LoyaltySection = ({ user, totalSpent, ordersCount }) => {
  const loyaltyPoints = Math.floor(totalSpent * 10);
  const pointsToNextTier = Math.max(0, 2000 - loyaltyPoints);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Status</h2>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {loyaltyPoints >= 2000
                ? "Platinum"
                : loyaltyPoints >= 1000
                ? "Gold"
                : "Silver"}{" "}
              Member
            </h3>
            <p className="text-yellow-100">
              {loyaltyPoints.toLocaleString()} points • {pointsToNextTier} to
              next tier
            </p>
          </div>
          <Shield className="h-12 w-12 text-white" />
        </div>

        <div className="mt-6 bg-yellow-400 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{
              width: `${Math.min(100, (loyaltyPoints / 2000) * 100)}%`,
            }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-yellow-100 mt-2">
          <span>Silver</span>
          <span>Gold</span>
          <span>Platinum</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {ordersCount}
          </div>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {loyaltyPoints.toLocaleString()}
          </div>
          <p className="text-gray-600">Loyalty Points</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ${totalSpent.toFixed(2)}
          </div>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltySection;
