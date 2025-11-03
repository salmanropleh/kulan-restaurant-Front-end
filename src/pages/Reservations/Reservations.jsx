import React, { useState } from "react";
import { Calendar, Clock, Users, Phone, Mail, Loader } from "lucide-react";
import Toast from "../../components/ui/Toast/Toast";

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Reservation submitted:", formData);
    setIsLoading(false);
    setShowSuccess(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: "2",
      specialRequests: "",
    });
  };

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
  ];

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      <Toast
        message="Reservation submitted successfully! We'll confirm shortly."
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Make a Reservation
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Secure your table for an unforgettable dining experience
          </p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="py-20">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 sticky top-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Quick Contact
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="bg-primary rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Call Us
                      </h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-primary rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email Us
                      </h3>
                      <p className="text-gray-600">
                        reservations@kulanrestaurant.com
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                    <h4 className="font-semibold text-primary mb-2">
                      Reservation Policy
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Reservations held for 15 minutes</li>
                      <li>• Groups of 6+ require 24h notice</li>
                      <li>• Special requests accommodated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Book Your Table
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="guests"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Number of Guests *
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "person" : "people"}
                          </option>
                        ))}
                        <option value="11">More than 10 people</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={today}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <Clock className="inline h-4 w-4 mr-2" />
                        Time *
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      placeholder="Any special occasions, dietary requirements, or preferences..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-accent disabled:bg-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 disabled:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Reserve Table</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Map/Additional Info Section */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-gray-600">
                      We look forward to serving you!
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Confirmation will be sent via email
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservations;
