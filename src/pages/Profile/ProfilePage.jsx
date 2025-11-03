// Front-End/src/pages/ProfilePage.jsx
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Add this import
import { User, Mail, Phone, Calendar, Shield, Bell } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this

  // Redirect to homepage if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Return null or loading state while redirecting
  if (!user) {
    return null; // or you can return a loading spinner
  }

  const formatPhoneNumber = (phone) => {
    // Handle undefined, null, or empty phone numbers
    if (!phone) {
      return "Not provided";
    }

    // Basic phone formatting
    const cleaned = phone.toString().replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  // Safe user data with fallbacks
  const safeUser = {
    firstName: user.firstName || "Not provided",
    lastName: user.lastName || "Not provided",
    fullName:
      user.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Not provided",
    email: user.email || "Not provided",
    phone: user.phone,
    createdAt: user.createdAt || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-lg text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {safeUser.fullName}
                </h2>
                <p className="text-gray-600 mt-1">Member</p>
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Member since{" "}
                    {new Date(safeUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Account Information
              </h3>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium text-gray-900">
                        {safeUser.firstName}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium text-gray-900">
                        {safeUser.lastName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">
                        {safeUser.email}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {formatPhoneNumber(safeUser.phone)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Account Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {new Date(safeUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Preferences
                  </h4>
                  <div className="p-6 bg-primary/5 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      We're working on adding more profile features like:
                    </p>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Order history and tracking</li>
                      <li>• Saved addresses for faster checkout</li>
                      <li>• Dietary preferences and allergies</li>
                      <li>• Newsletter and notification settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
