import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { orderApi } from "../../services/orderApi";
import { reservationsApi } from "../../services/reservationsApi";
import { contactAPI } from "../../services/contactAPI";
import { favoritesApi } from "../../services/favoritesApi"; // Add this import
import {
  ProfileSidebar,
  OverviewSection,
  OrdersSection,
  ReservationsSection,
  FavoritesSection,
  QuickActionsSection,
  LoyaltySection,
  ProfileInfoSection,
  PreferencesSection,
  MessagesSection,
} from "../../components/profile";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]); // Add favorites state
  const [loading, setLoading] = useState(false);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false); // Add favorites loading
  const [error, setError] = useState("");
  const [reservationsError, setReservationsError] = useState("");
  const [messagesError, setMessagesError] = useState("");
  const [favoritesError, setFavoritesError] = useState(""); // Add favorites error

  // Redirect to homepage if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch orders when orders section is active or on component mount
  useEffect(() => {
    if (user && (activeSection === "orders" || activeSection === "overview")) {
      fetchOrders();
    }
  }, [user, activeSection]);

  // Fetch reservations when reservations section is active or on component mount
  useEffect(() => {
    if (
      user &&
      (activeSection === "reservations" || activeSection === "overview")
    ) {
      fetchReservations();
    }
  }, [user, activeSection]);

  // Fetch messages when messages section is active or on component mount
  useEffect(() => {
    if (
      user &&
      (activeSection === "messages" || activeSection === "overview")
    ) {
      fetchMessages();
    }
  }, [user, activeSection]);

  // Fetch favorites when favorites section is active or on component mount
  useEffect(() => {
    if (
      user &&
      (activeSection === "favorites" || activeSection === "overview")
    ) {
      fetchFavorites();
    }
  }, [user, activeSection]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching orders for user:", user.email);
      const ordersData = await orderApi.getUserOrders();
      console.log("Orders API response:", ordersData);

      // Handle different response formats
      let ordersArray = [];

      if (Array.isArray(ordersData)) {
        ordersArray = ordersData;
      } else if (ordersData && Array.isArray(ordersData.results)) {
        // Handle paginated response
        ordersArray = ordersData.results;
      } else if (ordersData && Array.isArray(ordersData.orders)) {
        // Handle nested orders array
        ordersArray = ordersData.orders;
      } else if (ordersData && Array.isArray(ordersData.data)) {
        // Handle data property
        ordersArray = ordersData.data;
      } else {
        // If no array found, set empty array
        console.warn("Unexpected orders response format:", ordersData);
        ordersArray = [];
      }

      // Debug: Check if orders are filtered by user
      console.log("All orders from API:", ordersArray);
      console.log("Current user email:", user.email);

      // Filter orders by user email (frontend safety check)
      const userOrders = ordersArray.filter((order) => {
        const orderEmail = order.customer_email || order.email;
        const isUserOrder = orderEmail === user.email;
        console.log(
          `Order ${order.id}: ${orderEmail} vs ${user.email} - match: ${isUserOrder}`
        );
        return isUserOrder;
      });

      console.log("Filtered user orders:", userOrders);
      setOrders(userOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    setReservationsLoading(true);
    setReservationsError("");
    try {
      console.log("Fetching reservations for user:", user.email);

      // Use getMyReservations() instead of getUserReservations()
      const reservationsData = await reservationsApi.getMyReservations();

      console.log("Reservations API response:", reservationsData);

      // Handle different response formats
      let reservationsArray = [];

      if (Array.isArray(reservationsData)) {
        reservationsArray = reservationsData;
      } else if (reservationsData && Array.isArray(reservationsData.results)) {
        reservationsArray = reservationsData.results;
      } else if (reservationsData && Array.isArray(reservationsData.data)) {
        reservationsArray = reservationsData.data;
      } else {
        console.warn(
          "Unexpected reservations response format:",
          reservationsData
        );
        reservationsArray = [];
      }

      console.log("Filtered user reservations:", reservationsArray);
      setReservations(reservationsArray);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservationsError("Failed to load reservations. Please try again.");
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      console.log("Fetching messages for user:", user.email);
      const messagesData = await contactAPI.getUserMessages();
      console.log("Messages API response:", messagesData);

      // Handle different response formats
      let messagesArray = [];

      if (Array.isArray(messagesData)) {
        messagesArray = messagesData;
      } else if (messagesData && Array.isArray(messagesData.results)) {
        messagesArray = messagesData.results;
      } else if (messagesData && Array.isArray(messagesData.data)) {
        messagesArray = messagesData.data;
      } else {
        console.warn("Unexpected messages response format:", messagesData);
        messagesArray = [];
      }

      console.log("Filtered user messages:", messagesArray);
      setMessages(messagesArray);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessagesError("Failed to load messages. Please try again.");
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    setFavoritesError("");
    try {
      console.log("Fetching favorites for user:", user.email);
      const favoritesData = await favoritesApi.getFavorites();
      console.log("Favorites API response:", favoritesData);

      // Handle different response formats
      let favoritesArray = [];

      if (Array.isArray(favoritesData)) {
        favoritesArray = favoritesData;
      } else if (favoritesData && Array.isArray(favoritesData.results)) {
        favoritesArray = favoritesData.results;
      } else if (favoritesData && Array.isArray(favoritesData.data)) {
        favoritesArray = favoritesData.data;
      } else {
        console.warn("Unexpected favorites response format:", favoritesData);
        favoritesArray = [];
      }

      console.log("User favorites:", favoritesArray);
      setFavorites(favoritesArray);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setFavoritesError("Failed to load favorites. Please try again.");
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Return null or loading state while redirecting
  if (!user) {
    return null;
  }

  const getProfilePicture = () => {
    if (user.profile_picture) {
      return user.profile_picture.startsWith("http")
        ? user.profile_picture
        : `http://localhost:8000${user.profile_picture}`;
    }
    return null;
  };

  const profilePictureUrl = getProfilePicture();

  const safeUser = {
    firstName: user.first_name || user.firstName || "Not provided",
    lastName: user.last_name || user.lastName || "Not provided",
    fullName:
      user.full_name ||
      user.fullName ||
      `${user.first_name || user.firstName || ""} ${
        user.last_name || user.lastName || ""
      }`.trim() ||
      "Not provided",
    email: user.email || "Not provided",
    phone: user.phone_number || user.phone,
    createdAt: user.date_joined || user.createdAt || new Date().toISOString(),
    role: user.is_superuser
      ? "Super Administrator"
      : user.is_staff
      ? "Staff Member"
      : "Customer",
    isAdmin: user.is_staff || user.is_superuser,
  };

  // Calculate order stats with safety checks
  const activeOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        ["pending", "confirmed", "preparing"].includes(order.status)
      ).length
    : 0;

  const totalSpent = Array.isArray(orders)
    ? orders.reduce((total, order) => {
        return total + parseFloat(order.total_amount || 0);
      }, 0)
    : 0;

  // Transform favorites data to match the expected format for FavoritesSection
  const transformFavoritesData = (favorites) => {
    return favorites.map((fav) => ({
      id: fav.id,
      name: fav.menu_item?.name || fav.name || "Unknown Item",
      type: fav.menu_item?.category || fav.category || "Menu Item",
      lastOrdered: fav.last_ordered || "Not ordered yet",
      price: fav.menu_item?.price || fav.price || 0,
      image: fav.menu_item?.image || fav.image,
      description: fav.menu_item?.description || fav.description,
    }));
  };

  const transformedFavorites = transformFavoritesData(favorites);

  // Render different sections based on active selection
  const renderSectionContent = () => {
    const commonProps = {
      user: safeUser,
      orders,
      reservations,
      messages,
      loading,
      reservationsLoading,
      messagesLoading,
      error,
      reservationsError,
      messagesError,
      activeOrders,
      totalSpent,
      ordersCount: orders.length,
      reservationsCount: reservations.length,
      messagesCount: messages.length,
    };

    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection {...commonProps} favorites={transformedFavorites} />
        );
      case "orders":
        return (
          <OrdersSection orders={orders} loading={loading} error={error} />
        );
      case "reservations":
        return (
          <ReservationsSection
            reservations={reservations}
            loading={reservationsLoading}
            error={reservationsError}
            onReservationUpdate={fetchReservations}
          />
        );
      case "messages":
        return (
          <MessagesSection
            messages={messages}
            loading={messagesLoading}
            error={messagesError}
            onMessagesUpdate={fetchMessages}
          />
        );
      case "favorites":
        return (
          <FavoritesSection
            favorites={transformedFavorites}
            loading={favoritesLoading}
            error={favoritesError}
            onFavoritesUpdate={fetchFavorites}
          />
        );
      case "quick-actions":
        return <QuickActionsSection setActiveSection={setActiveSection} />;
      case "loyalty":
        return <LoyaltySection {...commonProps} />;
      case "profile":
        return (
          <ProfileInfoSection
            user={safeUser}
            profilePictureUrl={profilePictureUrl}
          />
        );
      case "preferences":
        return <PreferencesSection />;
      default:
        return (
          <OverviewSection {...commonProps} favorites={transformedFavorites} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Manage your orders, reservations, and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <ProfileSidebar
            user={safeUser}
            profilePictureUrl={profilePictureUrl}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            ordersCount={orders.length}
            reservationsCount={reservations.length}
            messagesCount={messages.length}
            favoritesCount={favorites.length} // Now using real favorites count
            loyaltyStatus="Gold"
            navigate={navigate}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
