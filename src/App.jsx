import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu/Menu";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import Reservations from "./pages/Reservations/Reservations";
import KulanSpecials from "./components/sections/KulanSpecials/KulanSpecials";
import Favorites from "./pages/Favorites/Favorites";
import CartPage from "./pages/OrderProcess/CartPage";
import Checkout from "./pages/OrderProcess/Checkout";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ProfilePage from "./pages/Profile/ProfilePage";
import OrderConfirmation from "./pages/OrderProcess/OrderConfirmation";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CheckoutRoute from "./components/CheckoutRoute/CheckoutRoute"; // FIXED IMPORT PATH

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* All front-facing routes wrapped in Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/food/:id" element={<FoodDetails />} />
                  <Route path="/specials" element={<KulanSpecials />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/order-online" element={<CartPage />} />
                  <Route
                    path="/checkout"
                    element={
                      <CheckoutRoute>
                        <Checkout />
                      </CheckoutRoute>
                    }
                  />{" "}
                  {/* FIXED: Only one checkout route */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation"
                    element={<OrderConfirmation />}
                  />
                  {/* REMOVED DUPLICATE CHECKOUT ROUTE */}
                </Routes>
              </Layout>
            }
          />

          {/* Admin dashboard route outside Layout with protection */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
