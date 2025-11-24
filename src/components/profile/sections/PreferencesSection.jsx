import React from "react";

const PreferencesSection = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">
      Preferences & Settings
    </h2>
    <div className="space-y-6">
      {[
        {
          title: "Notification Settings",
          description: "Manage email and push notifications",
        },
        {
          title: "Dietary Preferences",
          description: "Set your food preferences and allergies",
        },
        {
          title: "Payment Methods",
          description: "Manage saved payment options",
        },
        {
          title: "Delivery Addresses",
          description: "Add or edit delivery locations",
        },
        {
          title: "Privacy Settings",
          description: "Control your data and privacy",
        },
      ].map((pref, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div>
            <h3 className="font-semibold text-gray-900">{pref.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{pref.description}</p>
          </div>
          <button className="text-orange-600 hover:text-orange-700 font-medium">
            Manage
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default PreferencesSection;
