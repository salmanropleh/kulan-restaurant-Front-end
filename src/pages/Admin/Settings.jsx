import React, { useState } from "react";
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - replace with actual user data from context/API
  const [userData, setUserData] = useState({
    profile: {
      name: "Admin User",
      email: "admin@kulanrestaurant.com",
      phone: "+254 712 345 678",
      position: "Restaurant Manager",
      avatar: "/api/placeholder/100/100",
    },
    restaurant: {
      name: "KULAN Restaurant",
      description:
        "Authentic Somali cuisine with modern flair in the heart of Nairobi",
      address: "Westlands, Nairobi, Kenya",
      phone: "+254 712 345 678",
      email: "info@kulanrestaurant.com",
      website: "www.kulanrestaurant.com",
      openingHours: {
        monday: "09:00 - 22:00",
        tuesday: "09:00 - 22:00",
        wednesday: "09:00 - 22:00",
        thursday: "09:00 - 22:00",
        friday: "09:00 - 23:00",
        saturday: "10:00 - 23:00",
        sunday: "10:00 - 21:00",
      },
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      reservationAlerts: true,
      lowStockAlerts: true,
      weeklyReports: true,
    },
    preferences: {
      language: "english",
      timezone: "Africa/Nairobi",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      itemsPerPage: 25,
    },
  });

  const handleSave = async (section) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Saving ${section} settings:`, userData[section]);
    setIsLoading(false);
    // Add success notification here
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "restaurant", label: "Restaurant", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">
          Manage your account and restaurant settings
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center whitespace-nowrap px-4 py-3 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-500">
                  Update your account profile information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData.profile.name}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        profile: { ...userData.profile, name: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userData.profile.email}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        profile: { ...userData.profile, email: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userData.profile.phone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        profile: { ...userData.profile, phone: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={userData.profile.position}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        profile: {
                          ...userData.profile,
                          position: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave("profile")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}

          {/* Restaurant Settings */}
          {activeTab === "restaurant" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Restaurant Information
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your restaurant details and contact information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={userData.restaurant.name}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          name: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={userData.restaurant.description}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          description: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={userData.restaurant.address}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          address: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Westlands, Nairobi, Kenya"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={userData.restaurant.phone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.restaurant.email}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={userData.restaurant.website}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        restaurant: {
                          ...userData.restaurant,
                          website: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave("restaurant")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Restaurant Info"}</span>
              </button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Choose how you want to be notified about restaurant activities
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(userData.notifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </label>
                      <p className="text-xs text-gray-500">
                        Receive notifications for{" "}
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setUserData({
                          ...userData,
                          notifications: {
                            ...userData.notifications,
                            [key]: !value,
                          },
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSave("notifications")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Preferences"}</span>
              </button>
            </div>
          )}

          {/* Preferences Settings */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Application Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Customize your dashboard experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={userData.preferences.language}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        preferences: {
                          ...userData.preferences,
                          language: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="english">English</option>
                    <option value="kiswahili">Kiswahili</option>
                    <option value="somali">Somali</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={userData.preferences.timezone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        preferences: {
                          ...userData.preferences,
                          timezone: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Africa/Nairobi">Nairobi, Kenya (EAT)</option>
                    <option value="Africa/Dar_es_Salaam">
                      Dar es Salaam, Tanzania
                    </option>
                    <option value="Africa/Kampala">Kampala, Uganda</option>
                    <option value="Africa/Addis_Ababa">
                      Addis Ababa, Ethiopia
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={userData.preferences.dateFormat}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        preferences: {
                          ...userData.preferences,
                          dateFormat: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="DD/MM/YYYY">
                      DD/MM/YYYY (Kenya Standard)
                    </option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select
                    value={userData.preferences.timeFormat}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        preferences: {
                          ...userData.preferences,
                          timeFormat: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="24h">24-hour (Kenya Standard)</option>
                    <option value="12h">12-hour</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Items Per Page
                  </label>
                  <select
                    value={userData.preferences.itemsPerPage}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        preferences: {
                          ...userData.preferences,
                          itemsPerPage: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={10}>10 items</option>
                    <option value={25}>25 items</option>
                    <option value={50}>50 items</option>
                    <option value={100}>100 items</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSave("preferences")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Preferences"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
