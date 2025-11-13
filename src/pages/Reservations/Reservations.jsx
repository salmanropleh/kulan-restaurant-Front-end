// Front-End\src\pages\Reservations\Reservations.jsx
import React, { useState } from "react";
import { Calendar, Clock, Users, Phone, Mail, Loader } from "lucide-react";
import Toast from "../../components/ui/Toast/Toast";

const Reservations = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    reservation_date: "",
    reservation_time: "",
    number_of_guests: "2",
    special_requests: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch(
        "http://localhost:8000/api/reservations/reservations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // No authentication needed - public API
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle validation errors from Django
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }

        // Handle field-specific errors
        if (typeof errorData === "object") {
          const fieldErrors = Object.values(errorData).flat().join(", ");
          throw new Error(fieldErrors || "Failed to create reservation");
        }

        throw new Error("Failed to create reservation");
      }

      const result = await response.json();
      console.log("Reservation created:", result);

      setShowSuccess(true);

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        reservation_date: "",
        reservation_time: "",
        number_of_guests: "2",
        special_requests: "",
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      setErrorMessage(
        error.message || "Failed to create reservation. Please try again."
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];

  const today = new Date().toISOString().split("T")[0];

  // Format time for display (convert 24h to 12h)
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      <Toast
        message="Reservation submitted successfully! We'll confirm shortly."
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
      />

      {/* Error Toast */}
      <Toast
        message={errorMessage}
        isVisible={showError}
        onClose={() => setShowError(false)}
        type="error"
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
                        htmlFor="customer_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customer_email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="customer_email"
                        name="customer_email"
                        value={formData.customer_email}
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
                        htmlFor="customer_phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="customer_phone"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="number_of_guests"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Number of Guests *
                      </label>
                      <select
                        id="number_of_guests"
                        name="number_of_guests"
                        value={formData.number_of_guests}
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
                        htmlFor="reservation_date"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Date *
                      </label>
                      <input
                        type="date"
                        id="reservation_date"
                        name="reservation_date"
                        value={formData.reservation_date}
                        onChange={handleChange}
                        required
                        min={today}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="reservation_time"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        <Clock className="inline h-4 w-4 mr-2" />
                        Time *
                      </label>
                      <select
                        id="reservation_time"
                        name="reservation_time"
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors hover:border-primary/50"
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {formatTimeForDisplay(slot)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="special_requests"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Special Requests
                    </label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      value={formData.special_requests}
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

              {/* Additional Info Section */}
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
